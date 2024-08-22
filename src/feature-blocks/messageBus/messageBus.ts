import { ServiceBusClient, ServiceBusReceiver } from "@azure/service-bus";

const ACCESS_KEY_NAME: string =
  import.meta.env.VITE_SERVICE_BUS_ACCESS_KEY_NAME || "";
const ACCESS_KEY: string = import.meta.env.VITE_SERVICE_BUS_ACCESS_KEY || "";
const TOPIC_NAME: string = import.meta.env.VITE_SERVICE_BUS_TOPIC_NAME || "";

export interface IMessageBusCallbackParams {
  subscriptionName: string;
  actionId: string;
  isError: boolean;
  details?: string;
}

export const messageBus = {
  _receivers: {} as Record<string, ServiceBusReceiver>,

  _createReceiverId(serviceBusUrl: string, subscriptionName: string) {
    return `${serviceBusUrl}-${subscriptionName}`;
  },

  _createReceiver(
    serviceBusUrl: string,
    subscriptionName: string,
    callback: (params: IMessageBusCallbackParams) => void,
  ) {
    const connectionString = `Endpoint=${serviceBusUrl};SharedAccessKeyName=${ACCESS_KEY_NAME};SharedAccessKey=${ACCESS_KEY};EntityPath=${TOPIC_NAME}`;

    const serviceBusClient = new ServiceBusClient(connectionString);
    const receiver = serviceBusClient.createReceiver(
      TOPIC_NAME,
      subscriptionName,
    );

    receiver.subscribe({
      // eslint-disable-next-line @typescript-eslint/require-await
      async processMessage(message) {
        callback({
          subscriptionName,
          actionId: message?.body?.IdAction,
          isError: message?.body?.IsError,
          details: message?.body?.Content,
        });
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async processError(args) {
        console.error("messageBus", subscriptionName, args.error);
      },
    });

    return receiver;
  },

  subscribeTo(
    serviceBusUrl: string,
    subscriptionName: string,
    callback: (params: IMessageBusCallbackParams) => void,
  ) {
    const receiverId = messageBus._createReceiverId(
      serviceBusUrl,
      subscriptionName,
    );
    messageBus._receivers[receiverId] =
      messageBus._receivers[receiverId] ||
      messageBus._createReceiver(serviceBusUrl, subscriptionName, callback);
  },

  clear() {
    Object.values(messageBus._receivers).forEach((receiver) => {
      void receiver?.close();
    });
    messageBus._receivers = {};
  },
};

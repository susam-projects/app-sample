export default {
  translation: {
    common: {
      ok: "Ok",
      cancel: "Cancel",
      apiError: "An error has occurred",
      form: {
        error: {
          required: "The field is required",
          number: "It should be a number",
          startRangeValue: "Start range value must be less than finish value",
          dateCannotBeInPast: "The date cannot be in the past",
        },
        buttons: {
          save: "Save",
          cancel: "Cancel",
          create: "Create",
          reInit: "Re Init",
          on: "ON",
          off: "OFF",
          confirm: "Confirm",
          add: "Add",
          forceSync: "Force Synchronization",
          delete: "Delete",
        },
        loading: "Loading form data",
      },
      objectCreationInProgress: "Object creation in progress",
      confirmDisabling: "Confirm disabling the object?",
      onceDisabled: "Once disabled, the object cannot be reactivated",
    },
    auth: {
      title: "Ginkoia MTT",
      userName: "Username",
      password: "Password",
      login: "Log In",
      loginError: "Error authenticating with provided credentials",
      authError: "Unathorized",
    },
    objectsPage: {
      logout: "Logout",
      searchPlaceholder: "Search by keyword",
      tagsPlaceholder: "Search by tag",
      error: {
        loadingInitData: "Error loading tag list!",
        filteringData: "Error filtering object list!",
      },
      loadingForm: "Loading objects",
    },
    server: {
      form: {
        serverName: "Server name",
        url: "URL",
        port: "Port",
        login: "Login",
        password: "Password",
        testConnection: "Test connection",
      },
      error: {
        loading: "Error loading server data!",
      },
    },
    tenant: {
      form: {
        addTenantTitle: "Add new tenant",
        displayName: "Tenant display name",
        originalName: "Tenant original name",
        technicalName: "Tenant technical name",
        tags: "Tags",
        containerName: "Container name",
        template: "Tenant template",
        databaseVersion: "database version",
        containerUrl: "Container URL",
        connect: "Connect",
        containerSize: "Container size",
        tenantId: "Tenant ID",
        tenantSecret: "Tenant Secret",
        chain: "Chain",
      },
      success: {
        creatingTenant: "Tenant creation is in progress",
        updatingTenant: "Tenant update is in progress",
      },
      error: {
        loadingTenant: "Error loading tenant data!",
        loadingTemplates: "Error loading tenant templates!",
        loadingDatabaseVersions: "Error loading tenant database versions!",
        loadingContainerSizes: "Error loading container sizes!",
        loadingTags: "Error loading tags!",
        loadingChains: "Error loading chains!",
        creatingTenant: "Error creating tenant!",
        updatingTenant: "Error updating tenant!",
      },
      tasks: {
        addTenant: 'Add tenant "{{name}}"',
        updateTenant: 'Update tenant "{{name}}"',
      },
    },
    shop: {
      form: {
        addNewShop: "Add new shop",
        shopName: "Shop name",
        completeDisplayName: "Complete name",
        shortDisplayName: "Short name",
        pumpGroup: "Pump group",
        chain: "Chain",
        shopSign: "Shop sign",
        closingPeriod: "Closing periods",
        shopCode: "Shop code",
        replicationSite: "Replication site",
        adhCode: "Adh code",
        tiersCode: "Tiers code",
        newPumpGroupName: "New pump group Name",
        company: "Company",
        chainType: "Chain type",
        nameGenerate: "Name generate: {{name}}",
      },
      success: {
        creatingShop: "Shop creation is in progress",
        updatingShop: "Shop update is in progress",
      },
      error: {
        loadingShop: "Error loading shop data!",
        loadingBrandList: "Error loading brand list!",
        loadingChainList: "Error loading chain list!",
        creatingShop: "Error creating shop!",
        updatingShop: "Error updating shop!",
      },
      tasks: {
        addShop: 'Add shop "{{name}}"',
        updateShop: 'Update shop "{{name}}"',
      },
    },
    logicalStockGroup: {
      success: {
        creatingLogicalStockGroup:
          "Logical stock group creation is in progress",
      },
      error: {
        loadingLogicalStockGroup: "Error loading logical stock group data!",
        creatingLogicalStockGroup: "Error creating logical stock group!",
      },
      tasks: {
        addLogicalStockGroup: 'Add logical stock group "{{name}}"',
      },
    },
    replicationSite: {
      form: {
        title: "Add new replication site",
        replicationSiteName: "Replication site name",
        codeTiers: "Tiers code",
        guId: "GUID",
        baseId: "Base ID",
        genVersion: "GenVersion",
        siteType: "Site Type",
        range: "Range",
        rangeStart: "Range start",
        versionIdStart: "Version ID start",
        finish: "Finish",
        checkRange: "Check Range",
        token: "Token",
        mainShop: "Main shop",
        sender: "Sender",
      },
      success: {
        creatingReplicationSite: "Replication site creation is in progress",
        updatingReplicationSite: "Replication site update is in progress",
      },
      error: {
        loadingReplicationSite: "Error loading replication site data!",
        creatingReplicationSite: "Error creating replication site!",
        updatingReplicationSite: "Error updating replication site!",
      },
      tasks: {
        addReplicationSite: 'Add site "{{name}}"',
        updateReplicationSite: 'Update site "{{name}}"',
      },
    },
    objectTree: {
      error: {
        loadingInitData: "Error loading servers list! Please refresh the page",
        loadingChildren:
          "Error loading child objects! Please refresh the parent",
        noChildren: "The server responded with no children",
      },
      group: {
        server: "Servers",
        tenant: "Tenants",
        replicationSite: "Replication Sites",
        company: "Companies",
        shop: "Shops",
        device: "Devices",
        module: "Modules",
      },
      contextMenu: {
        reload: "Refresh",
        enable: "Enable",
        disable: "Disable",
        addChild: "Add new {{childType}}",
        showHistory: "See history",
        duplicate: "Duplicate",
        copyConfiguration: "Copy module configuration to all shops",
        error: {
          loadingObject: "Error loading object",
          updatingObject: "Error updating object",
        },
        success: {
          enabled: "The object is being enabled",
          disabled: "The object is being disabled",
        },
      },
      moveModal: {
        title: "Move objects",
        descriptionP1: "Do you want to move the selected objects:",
        descriptionP2: "into",
        descriptionP3: "?",
      },
    },
    tasks: {
      tasksButton: "{{taskCount}} Tasks",
      title: "Tasks",
      sections: {
        inProgressTitle: "In progress",
        inProgressEmpty: "No tasks in progress",
        finishedTitle: "Finished",
        finishedEmpty: "No finished tasks",
      },
      buttons: {
        loadMore: "Load more...",
      },
    },
    device: {
      form: {
        addNewDevice: "Add new device",
        deviceType: "Device Type",
        deviceNumber: "Device Number",
        proposalName: "Proposal Name",
        displayName: "Display Name",
      },
      success: {
        creatingDevice: "Device creation is in progress",
        updatingDevice: "Device update is in progress",
      },
      error: {
        loadingDevice: "Error loading device data!",
        loadingTypes: "Error loading device templates!",
        creatingDevice: "Error creating device!",
        updatingDevice: "Error updating device!",
      },
      tasks: {
        addDevice: 'Add device "{{name}}"',
        updateDevice: 'Update device "{{name}}"',
      },
    },
    module: {
      moduleList: "Module list of {{shopName}}",
      copyModuleConfig_one:
        "Copy this module configuration to all {{tenantName}} shops",
      copyModuleConfig_other:
        "Copy these modules configuration to all {{tenantName}} shops",
      doYouConfirm_one:
        "Are you sure you want to change the selected module status in each shop of {{tenantName}}?",
      doYouConfirm_other:
        "Are you sure you want to change the selected modules status in each shop of {{tenantName}}?",
      changeStatus: "Change module status",
      enabledToDisabled: "Enabled to Disabled?",
      disabledToEnabled: "Disabled to Enabled?",
      confStatusChangeModuleSelect:
        "Are you sure you want to change status of all selected modules?",
      error: {
        setStatus: "Error setting module status!",
      },
      warning: {
        noModulesToChange:
          "All selected modules already have the requested status!",
        noDataToChange: "Nothing to change!",
      },
      success: {
        setStatus: "The module statuses are updating now",
      },
      tasks: {
        updateStatus: 'Update status of module "{{name}}"',
        updateModule: 'Update module "{{name}}"',
        copyConfiguration:
          'Copy status of module "{{moduleName}}" to shop "{{shopName}}"',
      },
    },
    company: {
      form: {
        title: "Add new company",
        companyName: "Company Name",
        finYearEndDate: "Financial Year End Date",
      },
      success: {
        creatingCompany: "Company creation is in progress",
        updatingCompany: "Company update is in progress",
      },
      error: {
        loadingCompany: "Error loading company data!",
        creatingCompany: "Error creating company!",
        updatingCompany: "Error updating company!",
      },
      tasks: {
        addCompany: 'Add company "{{name}}"',
        updateCompany: 'Update company "{{name}}"',
      },
    },
    history: {
      headers: {
        date: "Date",
        user: "User",
        actionType: "Action Type",
        detail: "Detail",
        result: "Result",
        info: "Info",
        duration: "Duration",
      },
      history: "History",
      historyOf: "History of {{objectName}}",
      viewMore: "View More",
    },
    statusBar: {
      common: {
        open: "OPEN",
        closed: "CLOSED",
      },
      tags: {
        showMore: "see more",
        hide: "collapse",
      },
      tenant: {
        companies: "Companies",
        replicationSites: "Replication sites",
        shops: "Shops",
        devices: "Devices",
      },
      replicationSite: {
        tiersCode: "Tiers code",
        genVersion: "Gen version",
      },
      shop: {
        shopCode: "Shop code",
        adhCode: "Adh code",
      },
    },
    forceSynchronization: {
      error: "Error forcing synchronization!",
      success: "Synchronization is in progress!",
      task: 'Synchronize {{objectType}} "{{name}}"',
      objectType: {
        tenant: "tenant",
        shop: "shop",
        replicationSite: "replication site",
      },
    },
  },
} as const;

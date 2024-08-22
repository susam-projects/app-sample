import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";

import {
  loadRouteObjects,
  selectObjectsRoute,
  selectRouteKeys,
} from "../store/objectTree.slice.ts";

export const useObjectsRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const route = useAppSelector(selectObjectsRoute);
  const routeKeys = useAppSelector(selectRouteKeys);

  useEffect(() => {
    // using routeKeys here instead of routeObjectKeys
    // to correctly handle navigate back
    navigate(route, { state: routeKeys });
  }, [navigate, routeKeys, route]);

  useEffect(() => {
    dispatch(loadRouteObjects({ objectKeys: location.state }));
  }, [dispatch, location]);
};

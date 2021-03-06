/// <reference path="camelPlugin.ts"/>

namespace Camel {

  export class CamelNavigationService {

    private hasRestServices: boolean;

    constructor(private workspace: Jmx.Workspace, private jolokia: Jolokia.IJolokia) {
      'ngInject';
      this.hasRestServices = Camel.hasRestServices(workspace, jolokia);
    }

    getTabs(): Nav.HawtioTab[] {
      const tabs = [];
      const isCamelContext = this.workspace.isCamelContext();
      const isCamelVersionEQGT_2_13 = Camel.isCamelVersionEQGT(2, 13, this.workspace, this.jolokia);
      const isCamelVersionEQGT_2_14 = Camel.isCamelVersionEQGT(2, 14, this.workspace, this.jolokia);
      const isCamelVersionEQGT_2_15 = Camel.isCamelVersionEQGT(2, 15, this.workspace, this.jolokia);
      const isCamelVersionEQGT_2_16 = Camel.isCamelVersionEQGT(2, 16, this.workspace, this.jolokia);
      const isComponent = this.workspace.isComponent();
      const isComponentsFolder = this.workspace.isComponentsFolder();
      const isContextsFolder = this.workspace.selection && this.workspace.selection.key === 'camelContexts';
      const isEndpoint = this.workspace.isEndpoint();
      const isEndpointsFolder = this.workspace.isEndpointsFolder();
      const inEndpointRuntimeRegistry = getSelectionCamelEndpointRuntimeRegistry(this.workspace) !== null;
      const isDataformat = this.workspace.isDataformat();
      const isDebugMbean = Camel.getSelectionCamelDebugMBean(this.workspace) !== null;
      const isRestRegistry = getSelectionCamelRestRegistry(this.workspace) !== null;
      const isRoute = this.workspace.isRoute();
      const isRoutesFolder = this.workspace.isRoutesFolder();
      const isRouteMetrics = getSelectionCamelRouteMetrics(this.workspace) !== null;
      const isTraceMBean = Camel.getSelectionCamelTraceMBean(this.workspace) !== null;
      const canBrowse = this.workspace.hasInvokeRightsForName(getSelectionCamelInflightRepository(this.workspace), "browse");
      const canBrowseAllMessagesAsXml = this.workspace.hasInvokeRights(this.workspace.selection, "browseAllMessagesAsXml");
      const canDumpRoutesAsXml = this.workspace.hasInvokeRightsForName(getSelectionCamelContextMBean(this.workspace), "dumpRoutesAsXml");
      const canExplainEndpointJson = this.workspace.hasInvokeRights(this.workspace.selection, "explainEndpointJson");
      const canExplainComponentJson = this.workspace.hasInvokeRights(this.workspace.selection, "explainComponentJson");
      const canExplainDataFormatJson = this.workspace.hasInvokeRights(this.workspace.selection, "explainDataFormatJson");
      const canDumpAllTracedMessagesAsXml = this.workspace.hasInvokeRightsForName(Camel.getSelectionCamelTraceMBean(this.workspace), "dumpAllTracedMessagesAsXml");
      const canDumpStatisticsAsJson = this.workspace.hasInvokeRightsForName(getSelectionCamelRouteMetrics(this.workspace), "dumpStatisticsAsJson");
      const canGetBreakpoints = this.workspace.hasInvokeRightsForName(Camel.getSelectionCamelDebugMBean(this.workspace), "getBreakpoints");
      const canListRestServices = this.workspace.hasInvokeRightsForName(getSelectionCamelRestRegistry(this.workspace), "listRestServices");
      const canListTypeConverters = this.workspace.hasInvokeRightsForName(getSelectionCamelTypeConverter(this.workspace), "listTypeConverters");
      const canSeeEndpointStatistics = this.workspace.hasInvokeRightsForName(getSelectionCamelEndpointRuntimeRegistry(this.workspace), "endpointStatistics");
      const canSendMesssage = this.workspace.hasInvokeRights(this.workspace.selection, this.workspace.selection && this.workspace.selection.domain === "org.apache.camel" ? "sendBodyAndHeaders" : "sendTextMessage");

      if (!isContextsFolder && !isRoutesFolder) {
        tabs.push(new Nav.HawtioTab('Attributes', '/jmx/attributes'));
      }

      if (isContextsFolder) {
        tabs.push(new Nav.HawtioTab('Contexts', '/camel/contexts'));
      }

      if (isRoutesFolder) {
        tabs.push(new Nav.HawtioTab('Routes', '/camel/routes'));
      }

      if ((isRoute || isRoutesFolder) && canDumpRoutesAsXml) {
        tabs.push(new Nav.HawtioTab('Route Diagram', '/camel/routeDiagram'));
      }

      if (!isEndpointsFolder && !isEndpoint && (isRoute || isRoutesFolder) && canDumpRoutesAsXml) {
        tabs.push(new Nav.HawtioTab('Source', '/camel/source'));
      }

      if (isRouteNode(this.workspace)) {
        tabs.push(new Nav.HawtioTab('Properties', '/camel/propertiesRoute'));
      }

      if (isEndpoint && isCamelVersionEQGT_2_15 && canExplainEndpointJson) {
        tabs.push(new Nav.HawtioTab('Properties', '/camel/propertiesEndpoint'));
      }

      if (isComponent && isCamelVersionEQGT_2_15 && canExplainComponentJson) {
        tabs.push(new Nav.HawtioTab('Properties', '/camel/propertiesComponent'));
      }

      if (isDataformat && isCamelVersionEQGT_2_16 && canExplainDataFormatJson) {
        tabs.push(new Nav.HawtioTab('Properties', '/camel/propertiesDataFormat'));
      }

      if (!isEndpointsFolder && !isEndpoint && !isComponentsFolder &&
          !isComponent && (isCamelContext || isRoutesFolder || isRoute) &&
          isCamelVersionEQGT_2_15 && canBrowse) {
        tabs.push(new Nav.HawtioTab('Exchanges', '/camel/exchanges'));
      }

      if (!isEndpointsFolder && !isEndpoint && (isCamelContext || isRoutesFolder) &&
          isCamelVersionEQGT_2_14 && isRouteMetrics && canDumpStatisticsAsJson) {
        tabs.push(new Nav.HawtioTab('Route Metrics', '/camel/routeMetrics'));
      }

      if (!isRouteNode(this.workspace) && !isEndpointsFolder && !isEndpoint && !isComponentsFolder && !isComponent &&
          (isCamelContext || isRoutesFolder) && isCamelVersionEQGT_2_14 && isRestRegistry &&
          this.hasRestServices && canListRestServices) {
        tabs.push(new Nav.HawtioTab('REST Services', '/camel/restServices'));
      }

      if (!isEndpointsFolder && !isEndpoint && !isComponentsFolder && !isComponent &&
          (isCamelContext || isRoutesFolder) && isCamelVersionEQGT_2_16 && inEndpointRuntimeRegistry &&
          canSeeEndpointStatistics) {
        tabs.push(new Nav.HawtioTab('Endpoints (in/out)', '/camel/endpoints-statistics'));
      }

      if (!isRouteNode(this.workspace) && !isEndpointsFolder && !isEndpoint && !isComponentsFolder && !isComponent &&
          (isCamelContext || isRoutesFolder) && isCamelVersionEQGT_2_13 && canListTypeConverters) {
        tabs.push(new Nav.HawtioTab('Type Converters', '/camel/typeConverter'));
      }

      if (isRoute && isTraceMBean && canDumpAllTracedMessagesAsXml) {
        tabs.push(new Nav.HawtioTab('Profile', '/camel/profileRoute'));
      }

      if (isRoute && isDebugMbean && canGetBreakpoints) {
        tabs.push(new Nav.HawtioTab('Debug', '/camel/debugRoute'));
      }

      if (isRoute && isTraceMBean && canDumpAllTracedMessagesAsXml) {
        tabs.push(new Nav.HawtioTab('Trace', '/camel/traceRoute'));
      }

      if (isEndpoint && isBrowsableEndpoint(this.workspace.selection) && canBrowseAllMessagesAsXml) {
        tabs.push(new Nav.HawtioTab('Browse', '/camel/browseEndpoint'));
      }

      if (isEndpoint && canSendMesssage) {
        tabs.push(new Nav.HawtioTab('Send', '/camel/sendMessage'));
      }

      if (isEndpointsFolder) {
        tabs.push(new Nav.HawtioTab('Endpoints', '/camel/endpoints'));
      }

      if (!isContextsFolder && !isRoutesFolder) {
        tabs.push(new Nav.HawtioTab('Operations', '/jmx/operations'));
      }

      if (!isContextsFolder && !isRoutesFolder) {
        tabs.push(new Nav.HawtioTab('Chart', '/jmx/charts'));
      }

      return tabs;
    }

  }

  _module.service('camelNavigationService', CamelNavigationService);

}
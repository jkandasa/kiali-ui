import * as React from 'react';

import Namespace from '../../types/Namespace';
import { GraphParamsType, SummaryData } from '../../types/Graph';
import { Duration } from '../../types/GraphFilter';

import SummaryPanel from './SummaryPanel';
import CytoscapeGraph from '../../components/CytoscapeGraph/CytoscapeGraph';
import GraphFilterToolbar from '../../components/GraphFilter/GraphFilterToolbar';
import PfContainerNavVertical from '../../components/Pf/PfContainerNavVertical';
import { computePrometheusQueryInterval } from '../../services/Prometheus';
import { style } from 'typestyle';

import GraphLegend from '../../components/GraphFilter/GraphLegend';

type ServiceGraphPageState = {
  // stateless
};

type ServiceGraphPageProps = GraphParamsType & {
  graphTimestamp: string;
  graphData: any;
  isLoading: boolean;
  hideLegend: boolean;
  isReady: boolean;
  fetchGraphData: (namespace: Namespace, graphDuration: Duration) => any;
  summaryData: SummaryData | null;
  handleLegend: () => void;
};
const NUMBER_OF_DATAPOINTS = 30;

const cytscapeGraphStyle = style({
  position: 'absolute',
  right: 20,
  bottom: 0,
  top: 170,
  left: 220
});

export default class ServiceGraphPage extends React.Component<ServiceGraphPageProps, ServiceGraphPageState> {
  constructor(props: ServiceGraphPageProps) {
    super(props);

    this.state = {
      summaryData: { summaryType: 'graph', summaryTarget: null }
    };
  }

  componentDidMount() {
    this.loadGraphDataFromBackend();
  }

  componentWillReceiveProps(nextProps: ServiceGraphPageProps) {
    const nextNamespace = nextProps.namespace;
    const nextDuration = nextProps.graphDuration;

    const namespaceHasChanged = nextNamespace.name !== this.props.namespace.name;
    const durationHasChanged = nextDuration.value !== this.props.graphDuration.value;

    if (namespaceHasChanged || durationHasChanged) {
      this.loadGraphDataFromBackend(nextNamespace, nextDuration);
    }
  }

  handleRefreshClick = () => {
    this.loadGraphDataFromBackend();
  };

  render() {
    const graphParams: GraphParamsType = {
      namespace: this.props.namespace,
      graphLayout: this.props.graphLayout,
      edgeLabelMode: this.props.edgeLabelMode,
      graphDuration: this.props.graphDuration
    };
    return (
      <PfContainerNavVertical>
        <h2>Service Graph</h2>
        <GraphFilterToolbar
          isLoading={this.props.isLoading}
          handleRefreshClick={this.handleRefreshClick}
          handleLegendClick={this.props.handleLegend}
          hideLegend={this.props.hideLegend}
          {...graphParams}
        />
        <div className={cytscapeGraphStyle}>
          <CytoscapeGraph
            {...graphParams}
            isLoading={this.props.isLoading}
            elements={this.props.graphData}
            refresh={this.handleRefreshClick}
          />
          {this.props.summaryData ? (
            <SummaryPanel
              data={this.props.summaryData}
              namespace={this.props.namespace.name}
              queryTime={this.props.graphTimestamp}
              duration={this.props.graphDuration.value}
              {...computePrometheusQueryInterval(this.props.graphDuration.value, NUMBER_OF_DATAPOINTS)}
            />
          ) : null}
        </div>
        {!this.props.hideLegend && <GraphLegend closeLegend={this.props.handleLegend} />}
      </PfContainerNavVertical>
    );
  }

  /** Fetch graph data */
  loadGraphDataFromBackend = (namespace?: Namespace, graphDuration?: Duration) => {
    namespace = namespace ? namespace : this.props.namespace;
    graphDuration = graphDuration ? graphDuration : this.props.graphDuration;
    this.props.fetchGraphData(namespace, graphDuration);
    this.setState({
      summaryData: null
    });
  };
}

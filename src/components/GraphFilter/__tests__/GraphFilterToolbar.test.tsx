import * as React from 'react';
import { shallow } from 'enzyme';

import { GraphParamsType } from '../../../types/Graph';
import { Duration, Layout, EdgeLabelMode } from '../../../types/GraphFilter';
import Namespace from '../../../types/Namespace';

import GraphFilterToolbar from '../GraphFilterToolbar';

const PARAMS: GraphParamsType = {
  namespace: { name: 'itsio-system' },
  graphDuration: { value: 60 },
  graphLayout: { name: 'Cose' },
  edgeLabelMode: EdgeLabelMode.HIDE
};

describe('ServiceGraphPage test', () => {
  it('should propagate filter params change with correct value', () => {
    const onParamsChangeMockFn = jest.fn();
    const wrapper = shallow(
      <GraphFilterToolbar
        {...PARAMS}
        isLoading={false}
        handleRefreshClick={jest.fn()}
        handleLegendClick={jest.fn()}
        hideLegend={true}
      />
    );

    const toolbar = wrapper.instance() as GraphFilterToolbar;
    toolbar.handleFilterChange = onParamsChangeMockFn;

    const newLayout: Layout = { name: 'Cola' };
    toolbar.handleLayoutChange(newLayout); // simulate layout change
    const EXPECT1 = Object.assign({}, PARAMS, { graphLayout: newLayout });
    expect(onParamsChangeMockFn).toHaveBeenLastCalledWith(EXPECT1);

    const newDuration: Duration = { value: 1800 };
    toolbar.handleDurationChange(newDuration); // simulate duration change
    const EXPECT2 = Object.assign({}, PARAMS, { graphDuration: newDuration });
    expect(onParamsChangeMockFn).toHaveBeenLastCalledWith(EXPECT2);

    const newNamespace: Namespace = { name: 'bookinfo' };
    toolbar.handleNamespaceChange(newNamespace); // simulate name change
    const EXPECT3 = Object.assign({}, PARAMS, { namespace: newNamespace });
    expect(onParamsChangeMockFn).toHaveBeenLastCalledWith(EXPECT3);
  });
});

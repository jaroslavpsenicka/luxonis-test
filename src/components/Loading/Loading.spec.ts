import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import { Loading } from "./Loading";

configure({ adapter: new Adapter() });

describe('Loading', () => {

  it('render', () => {
    const wrapper = shallow(<Loading />)
    expect(wrapper).toMatchSnapshot()
  })

})

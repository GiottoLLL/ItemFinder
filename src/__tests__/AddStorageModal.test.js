import { render } from '@testing-library/react-native'

import AddStorageModal from '../components/common/AddStorageModal'

describe('AddStorageModal', () => {
  it('visible=false 时不渲染', () => {
    const { queryByText } = render(
      <AddStorageModal onConfirm={jest.fn()} onRequestClose={jest.fn()} visible={false} />
    )

    expect(queryByText('添加存储空间')).toBeNull()
  })

  it('visible=true 时渲染标题与按钮', () => {
    const { getByText } = render(
      <AddStorageModal onConfirm={jest.fn()} onRequestClose={jest.fn()} visible />
    )

    expect(getByText('添加存储空间')).toBeTruthy()
    expect(getByText('取消')).toBeTruthy()
    expect(getByText('确认添加')).toBeTruthy()
  })
})


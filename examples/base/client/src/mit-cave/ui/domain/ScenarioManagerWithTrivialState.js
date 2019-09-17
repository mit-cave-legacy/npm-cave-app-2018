import React from 'react'
import { NEW_ID, ScenarioManager } from './ScenarioManager'
import * as PropTypes from 'prop-types'

/*
 * Encapsulates trivial state and manages window events:
 *   * pickedId
 *   * expanded
 * So that the outside world does not have to if it choose not to
 */
export class ScenarioManagerWithTrivialState extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onAdd: PropTypes.func,
    detailId: PropTypes.any
  }
  state = {
    detailId: null
  }
  onAdd = () => {
    this.setState({
      detailId: NEW_ID
    })
    if (this.props.onAdd) {
      this.props.onAdd()
    }
  }
  onSave = obj => {
    // this.setState({
    //   expanded: false,
    //   adding: false,
    // })
    // this.props.onSave(obj)
  }
  onClose = () => {
    this.setState({
      detailId: null
    })
    this.props.onClose()
  }
  onPicked = id => {
    this.setState({
      expanded: this.state.pickedId !== id || !this.state.expanded
    })
  }
  onCloseDetail = () => {
    this.setState({
      detailId: null
    })
  }
  onDelete = id => {
    this.setState({
      detailId: null
    })
    this.props.onDelete(id)
  }
  onOpenDetail = id => {
    this.setState({
      detailId: id
    })
  }

  render() {
    const { data, onSelect, onSave, value, hide, ...props } = this.props
    const { detailId, adding } = this.state
    const { onAdd, onDelete, onClose, onOpenDetail, onCloseDetail } = this
    return (
      <ScenarioManager
        hide={hide}
        data={data}
        adding={adding}
        detailId={detailId}
        value={value}
        onSave={onSave}
        onAdd={onAdd}
        onDelete={onDelete}
        onSelect={onSelect}
        onCloseDetail={onCloseDetail}
        onOpenDetail={onOpenDetail}
        onClose={onClose}
        {...props}
      />
    )
  }
}

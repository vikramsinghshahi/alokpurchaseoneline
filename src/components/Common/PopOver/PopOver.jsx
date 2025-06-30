import React, { Component } from 'react';
import { bool, func, number, any, string, object } from 'prop-types';
import RelativePortal from 'react-relative-portal';
// import { AlertNotification } from 'Common/Toasts/AlertNotification';
import './PopOver.scss';

export default class PopOver extends Component {
  static propTypes = {
    modalState: bool,
    onOpenEvent: func,
    onCloseEvent: func,
    // portalYOffset: number,
    // portalXOffset: number,
    // portalInnerHeight: number,
    // portalInnerWidth: number,
    buttonDisabled: bool,
    enablePortal: bool,
    className: string,
    buttonClass: string,
    portalID: string,
    activeClass: string,
    button: object,
    content: any,
    isMasterDetailHasUpdatedData: func,
    columnChooserTitle: string,
    handleBlur: func,
    onClear: any,
  };

  static defaultProps = {
    modalState: undefined,
    onOpenEvent: undefined,
    onCloseEvent: undefined,
    // portalYOffset: 0,
    // portalXOffset: 0,
    // portalInnerHeight: 0,
    // portalInnerWidth: 0,
  };

  modalRef = React.createRef();

  contentRef = React.createRef();

  buttonRef = React.createRef();

  state = {
    showModal: false,
    top: 0,
    left: 0,
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  componentDidUpdate(prevProps, prevState) {
    const { enablePortal, modalState, refreshData } = this.props;
    const { showModal } = this.state;

    if (
      enablePortal &&
      ((prevState.showModal === false && showModal === true) ||
        (prevProps.modalState === false && modalState === true))
    ) {
      this.calcRect();
    }
  }

  handleClick = (e) => {
    const { onClear } = this.props;
    const portal = document.getElementsByClassName('popOverPortal')[0];
    const portalClick = portal ? !portal.contains(e.target) : true;
    const modalIsOpen = this.modalIsOpen();
    if (
      e &&
      e.target &&
      e.target.classList &&
      e.target.classList.contains('clear') &&
      onClear
    ) {
      onClear();
    }
    if (
      e &&
      e.target &&
      e.target.classList &&
      modalIsOpen &&
      this.modalRef &&
      this.modalRef.current &&
      !this.modalRef.current.contains(e.target) &&
      portalClick &&
      !e.target.classList.contains('Select__option') &&
      !e.target.classList.contains('Select__indicator')
    ) {
      this.closeModal();
    }
  };

  handleModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const removeExistingModel =
      document.body.querySelector('.formSectionTitle');
    if (removeExistingModel) {
      removeExistingModel.click();
    }
    const modalIsOpen = this.modalIsOpen();

    return modalIsOpen ? this.closeModal() : this.openModal();
  };

  openModal = () => {
    const {
      onOpenEvent,
      refreshData,
      columnChooserTitle,
      isMasterDetailHasUpdatedData,
    } = this.props;
    if (refreshData) {
      refreshData();
    }

    document.addEventListener('mousedown', this.handleClick, false);
    if (onOpenEvent) {
      onOpenEvent();
    } else {
      this.setState({ showModal: true });
    }

    if (isMasterDetailHasUpdatedData && isMasterDetailHasUpdatedData()) {
      AlertNotification({
        message: `Please save your changes before using the ${
          (columnChooserTitle && columnChooserTitle.toLowerCase()) ||
          'column chooser'
        }.`,
        type: 'warning',
      });
    }
  };

  closeModal = () => {
    const { onCloseEvent, handleBlur } = this.props;

    document.removeEventListener('mousedown', this.handleClick, false);
    if (onCloseEvent) {
      onCloseEvent();
      this.setState({ showModal: false });
    } else {
      this.setState({ showModal: false });
    }
    if (handleBlur) {
      handleBlur();
    }
  };

  modalIsOpen = () => {
    const { showModal } = this.state;
    const { modalState } = this.props;
    return typeof modalState === 'boolean' ? modalState : showModal;
  };

  calcRect = () => {
    const rect =
      this.modalRef.current && this.modalRef.current.getBoundingClientRect();

    const contentRect = this.contentRef.current
      ? this.contentRef.current.getBoundingClientRect()
      : { height: 0, width: 0 };

    let top = 0;
    if (rect && rect.bottom + 20 > window.innerHeight - contentRect.height) {
      const gapFromTop = window.innerHeight - contentRect.height;
      top = gapFromTop > 317 ? 0 - contentRect.height - rect.height - 10 : 0;
    }

    let left = -contentRect.width;
    // TODO: need to add props for aligning left, right, etc
    // if (rect && rect.right > window.innerWidth - contentRect.width) {
    // 	left = contentRect.width
    // }
    if (left <= 0) {
      left = 1;
    }
    const modalWidth = contentRect.width;
    const inputWidth = rect.width;
    const inputLeft = rect.left;

    if (inputLeft + modalWidth < window.innerWidth) {
      left = -inputWidth;
    } else {
      left = -modalWidth;
    }
    console.log({ top, left }, window.innerHeight, contentRect);
    this.setState({ top, left });
  };

  renderPortalContent = () => {
    const { content, portalID } = this.props;

    const { top, left } = this.state;

    return (
      <RelativePortal component="div" left={left} top={top}>
        <div ref={this.contentRef} id={portalID} className="popOverPortal">
          {content}
        </div>
      </RelativePortal>
    );
  };

  render() {
    const {
      button,
      buttonClass,
      buttonDisabled,
      content,
      activeClass,
      className,
      enablePortal,
      enableHover,
      hoverIconVisible,
      dataTip,
      dataFor,
    } = this.props;

    const btnClass =
      this.modalIsOpen() && activeClass
        ? `${buttonClass} ${activeClass}`
        : buttonClass;
    const containerClass = className ? `popOver ${className}` : 'popOver';
    const contentHolder = enablePortal ? this.renderPortalContent() : content;
    return (
      <div className={containerClass} ref={this.modalRef}>
        {hoverIconVisible ? (
          <span
            onClick={this.handleModal}
            onMouseMove={enableHover && this.handleModal}
          >
            {button}
          </span>
        ) : (
          <button
            type="button"
            className={btnClass}
            disabled={buttonDisabled}
            onClick={this.handleModal}
            onMouseOver={enableHover && this.handleModal}
            onMouseOut={enableHover && this.handleModal}
            data-tip={dataTip}
            data-for={dataFor}
          >
            {button}
          </button>
        )}
        <div className="popOverContainer">
          {this.modalIsOpen() ? contentHolder : null}
        </div>
      </div>
    );
  }
}

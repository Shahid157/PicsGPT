const initialState = {
  isModalOpen: false,
};

const SHOW_MODAL = 'SHOW_MODAL';
// Define action interfaces
export default function modalReducer(state = initialState, action: any) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        isModalOpen: action.payload,
      };
    default:
      return initialState;
  }
}

export const modalShow = (payload: boolean) => ({
  type: SHOW_MODAL,
  payload: payload,
});

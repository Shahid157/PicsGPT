const initialState = {
  isChatOpen: false,
};

const OPEN_CHAT = 'OPEN_CHAT';

export default function chatReducer(state = initialState, action: any) {
  switch (action.type) {
    case OPEN_CHAT:
      return {
        ...state,
        isChatOpen: action.payload,
      };
    default:
      return initialState;
  }
}

export const chatOpen = (payload: boolean) => ({
  type: OPEN_CHAT,
  payload: payload,
});

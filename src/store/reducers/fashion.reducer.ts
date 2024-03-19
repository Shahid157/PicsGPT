import {
  FASHION_REQUESTED,
  UPADTE_SELECTED_BRAND,
  UPDATE_INFERENCES,
  HANDLE_USER_AGENT,
  UPADTE_SELECTED_CELEBRITY,
  UPDATE_QUANTITY_OF_MEDIA_GENERATED,
  UPDATE_PROMPT,
  UPDATE_SLECTED_STYLES,
  UPDATE_FASHION_DATA,
  FETCH_PROMPTS,
  FETCH_MODELS,
  FETCH_GARMENTS,
  FETCH_PRICING_METHODS,
  USER_MODELS,
  USER_CUSTOM_MODELS,
  USER_GENERATIONS,
  FETCH_BRANDS,
  FETCH_GARMENT_SIZES,
  FETCH_PHOTO_STYLES,
} from '../types/fashion.types';

const intialState = {
  loading: false,
  selectedCelebrity: null,
  prompt: '',
  selectedStyles: null,
  quantityOfMediaGenerated: 6,
  inferences: [],
  userAgent: null,
  loginInfo: {},
  selectedImageLocation: null,
  prompts: [],
  models: [],
  garments: [],
  fantasyGarments: [],
  pricingMethods: [],
  celebs: [],
  user_collection: [],
  user_custom_models: [],
  user_generations: [],
  pricingMethods_homeAi: [],
  popularBrands: [],
  garmentSizes: [],
  photo_styles: [],
  photo_style_filters: [],
  loading_photo_styles: true,
  single_id_generations: [],
  inProgress: [],
};

const usersReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case FASHION_REQUESTED:
      return {...state, loading: action.payload.loading};
    case UPADTE_SELECTED_CELEBRITY:
    case USER_CUSTOM_MODELS:
    case USER_GENERATIONS:
    case FETCH_BRANDS:
    case FETCH_GARMENT_SIZES:
    case FETCH_PHOTO_STYLES:
      return {
        ...state,
        ...action.payload,
      };
    case UPADTE_SELECTED_BRAND:
      return {
        ...state,
        selectedBrand: action.payload.selectedBrand,
      };
    case UPDATE_INFERENCES:
      return {
        ...state,
        inferences: action.payload.inferences,
      };
    case UPDATE_FASHION_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_PROMPT:
      return {
        ...state,
        prompt: action.payload.prompt,
      };
    case UPDATE_SLECTED_STYLES:
      return {
        ...state,
        selectedStyles: action.payload.selectedStyles,
      };
    case UPDATE_QUANTITY_OF_MEDIA_GENERATED:
      return {
        ...state,
        quantityOfMediaGenerated: action.payload.quantityOfMediaGenerated,
      };
    case HANDLE_USER_AGENT:
      return {
        ...state,
        userAgent: action.payload.userAgent,
      };
    case FETCH_PROMPTS:
      return {
        ...state,
        prompts: action.payload.prompts,
        selectedImageLocation:
          action.payload.prompts[
            action.payload.prompts[Math.floor(Math.random() * 3)]
          ],
      };
    case FETCH_MODELS:
      return {
        ...state,
        models: action.payload.models,
        celebs: action.payload.celebs,
      };
    case FETCH_PRICING_METHODS:
      return {
        ...state,
        pricingMethods: action.payload.pricingMethods,
        pricingMethods_homeAi: action.payload.pricingMethods_homeAi,
      };
    case FETCH_GARMENTS:
      return {
        ...state,
        garments: action.payload.garments,
        fantasyGarments: action.payload.fantasyGarments,
      };
    case USER_MODELS:
      return {
        ...state,
        user_collection: action.payload.user_collection,
      };
    default:
      return state;
  }
};

export default usersReducer;

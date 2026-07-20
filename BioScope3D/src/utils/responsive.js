import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// scale: for width, paddingHorizontal, marginHorizontal, etc.
const scale = size => (width / guidelineBaseWidth) * size;

// verticalScale: for height, paddingVertical, marginVertical, etc.
const verticalScale = size => (height / guidelineBaseHeight) * size;

// moderateScale: for fonts, borderRadius, and mixed scaling (to avoid huge jumps on tablets)
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale, width, height };

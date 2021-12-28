import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

/**
 * Palette: https://coolors.co/fafafa-9b59b6-00a0dc-e74c3c-34495e
 */
export default new Vuetify({
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        background: '#FAFAFA', // white: CULTURED
        primary: '#FFFFFF', // white: BASE
        secondary: {
          base: '#34495E', // Grey: CHARCOAL
          lighten1: '#7b99b7', // Grey: CHARCOAL
        },
        unselected: '#CACCCE', // Gtry:
        accent: {
          base: '#00A0DC', // Blue: BABY BLUE
          lighten1: '#c2efff', // Blue: CAROLINA
        },
        success: '#16A085', // Green: Veronese
        info: '#8bc53f', //
        warning: {
          base: '#9b59b6', //PURPLE:  Lilac
          lighten1: '#cbaad8', // Blue: CAROLINA
        },
        error: '#E74C3C', // Red: CINNABAR
      },
    },
  },
});

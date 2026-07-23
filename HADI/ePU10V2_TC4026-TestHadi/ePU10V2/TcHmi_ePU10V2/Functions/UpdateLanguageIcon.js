// Keep these lines for a best effort IntelliSense in the editor.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.14.4.42/runtimes/native1.12-tchmi/TcHmi.d.ts" />

// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the correct folder in runtime and in tsconfig.json
import {
  // Full es module version of TcHmi.Functions
  Functions,
} from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * @param {TcHmi.Controls.System.TcHmiControl} NavBar
 * @param {string} Locale
 */
function UpdateLanguageIcon(NavBar, Locale) {
  if (!NavBar) return;

  if (!Locale) return;

  if (
    NavBar.getType() !==
    'TcHmi.Controls.ResponsiveNavigation.TcHmiNavigationBar'
  )
    return;

  var data = NavBar.getMenuSourceDataRaw();

  if (!data || !data[0]) return;

  /** @type {string | undefined} */
  var icon;
  var fallback;

  for (var firstChildlayer of data[0].children) {
    if (firstChildlayer.children) {
      for (var secondChildlayer of firstChildlayer.children) {
        if (secondChildlayer.parameter === Locale) {
          icon = secondChildlayer.image;
          break;
        }
        // The browser locale can be "en" while the parameter is "en-US"
        // or the other way round
        if (
          secondChildlayer.parameter &&
          secondChildlayer.parameter.split('-')[0] === Locale.split('-')[0] &&
          !fallback
        ) {
          fallback = secondChildlayer.image;
        }
      }
    }
  }

  if (icon) {
    data[0].image = icon;
    NavBar.setMenuSourceData(data);
  } else if (fallback) {
    data[0].image = fallback;
    NavBar.setMenuSourceData(data);
  }
}

Functions.registerFunctionEx(
  'UpdateLanguageIcon',
  'TcHmi.Functions',
  UpdateLanguageIcon,
);

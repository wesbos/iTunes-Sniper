const { app, Menu, Tray, nativeTheme, systemPreferences } = require('electron');
const monitor = require('../overkill');

let intervalId;

const switchOnOff = commandId => {
  if (commandId === 1) {
    intervalId = setInterval(monitor, 1000);
  } else if (commandId === 2) {
    clearInterval(intervalId);
  }
};

let tray = null;
app.on('ready', () => {
  const isDarkMode = () => nativeTheme.shouldUseDarkColors;
  const trayIcon = isDarkMode =>
    `${__dirname}/assets/target-${isDarkMode ? 'white' : 'black'}.png`;

  tray = new Tray(trayIcon(isDarkMode()));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'On',
      type: 'radio',
      checked: true,
      click: e => {
        switchOnOff(e.commandId);
      }
    },
    {
      label: 'Off',
      type: 'radio',
      click: e => {
        switchOnOff(e.commandId);
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      type: 'normal',
      click: e => {
        tray.destroy();
      }
    }
    // to do
    // { label: 'Start on boot', type: 'checkbox', checked: true }
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  // startup
  (() => {
    const startupOption = contextMenu.items.find(item => item.label === 'On');
    if (startupOption.checked) {
      switchOnOff(1);
    }
  })();

  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => {
      tray.setImage(trayIcon(isDarkMode()));
    }
  );
});

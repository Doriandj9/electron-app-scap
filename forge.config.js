module.exports = {
  packagerConfig: {
      icon: "agua.ico",
      platform:["win32"]    
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      platforms: ['darwin', 'linux'],
      config: {
        bucket: 'my-bucket',
        folder: 'instalador/uno/app'
      }
    }
  ]
};
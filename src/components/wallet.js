import { Core } from '@walletconnect/core';
import { WalletKit } from '@reown/walletkit';

const core = new Core({
  projectId: 'e6987739efe767716ded22d870d5a6db' // Use your actual project ID
});

const walletKit = await WalletKit.init({
  core, 
  metadata: {
    name: 'WallstreetDAO',
    description: 'AppKit Example',
    url: 'http://localhost:5173',
    icons: ['https://assets.reown.com/reown-profile-pic.png']
  }
});

export default walletKit;

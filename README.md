# Welcome to your Expo app 👋

Project Setup: React Native & Expo
This guide provides a comprehensive, step-by-step walkthrough for setting up your development environment. Follow these instructions carefully to ensure everything runs smoothly.

1. Core Prerequisites
Before touching the mobile settings, ensure your machine has the foundational tools installed.

Install Node.js
Download: Go to Node.js Official Website and download the LTS version.

Setup: Run the installer using the standard/default options.

Verify: Open your terminal (Command Prompt, PowerShell, or Zsh) and run:

Bash
node -v
If a version number appears, you’re good to go.

Install Dependencies
Navigate to your project folder in the terminal and run:

Bash
npm install
2. Android Studio & Environment Setup
The "Ben Section": This part is crucial. Even if you use default installs, you must configure your "Path" so your computer knows where the Android tools live. Reference the Official Expo Docs if you need visual aids.

Phase 1: Finding Your Android SDK Path
Open Android Studio.

On the welcome screen, click More Actions > SDK Manager.

Note: If a project is already open, go to Settings (Windows) or Settings/Preferences (macOS) > Languages & Frameworks > Android SDK.

At the top, look for Android SDK Location.

Copy this path exactly.

Windows Default: C:\Users\YourName\AppData\Local\Android\Sdk

macOS Default: /Users/YourName/Library/Android/sdk

Phase 2: macOS Setup (Zsh or Bash)
Modern Macs use Zsh, while older ones use Bash.

Open Terminal.

Check your shell: echo $SHELL

If it says /bin/zsh, you edit ~/.zshrc.

If it says /bin/bash, you edit ~/.bash_profile.

Open the editor:

Bash
nano ~/.zshrc  # or nano ~/.bash_profile
Scroll to the bottom and paste the following (replacing the path with the one you copied in Phase 1):

Bash
export ANDROID_HOME=/Users/YourName/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
Save/Exit: Press Ctrl + O, then Enter, then Ctrl + X.

Refresh: Run source ~/.zshrc (or source ~/.bash_profile).

Phase 3: Windows Setup (Environment Variables)
Search for "env" in the Start Menu and select Edit the system environment variables.

Click Environment Variables (bottom right).

Create ANDROID_HOME:

Under User variables, click New.

Variable name: ANDROID_HOME

Variable value: Paste your SDK path (e.g., C:\Users\Ben\AppData\Local\Android\Sdk).

Update Path:

In User variables, select Path and click Edit.

Click New and add: %ANDROID_HOME%\platform-tools

Click New again and add: %ANDROID_HOME%\emulator

Apply: Click OK on all windows and restart your terminal/VS Code.

Phase 4: Final SDK Checklist
In the Android Studio SDK Manager, ensure the following are installed:

SDK Platforms Tab: Check the latest Android version (e.g., Android 14 or 15).

SDK Tools Tab: Ensure these are checked:

Android SDK Build-Tools

Android Emulator

Android SDK Platform-Tools

Click Apply to install.

Phase 5: Verification
Run these commands to verify your setup:

adb --version → Should show "Android Debug Bridge version..."

emulator -list-avds → Should list your devices or return empty (no error).

3. Launching the App
Start the Expo Server
Bash
npx expo start
[!IMPORTANT]
Windows PowerShell Error: If you see a red "running scripts is disabled" error, open PowerShell as Administrator and run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Type Y and restart your terminal.

See It Live
Virtual Phone (Emulator): Ensure your emulator is running in Android Studio. In your VS Code terminal, press a. The app will open automatically.

Physical Device: Download the Expo Go app on your phone and scan the QR code displayed in the terminal.

Live Updates: Open your project in VS Code (e.g., app/index.tsx), change some text, and hit Save. The app will update instantly!
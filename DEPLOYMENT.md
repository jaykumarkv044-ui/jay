# How to Put Your Website on the Internet

Right now, your health insurance checker website only lives on your computer. To let anyone in the world use it, you need to "host" it on the internet.

Don't worry, it's easier than it sounds! The easiest way for a beginner to do this is using a service like **Render** or **Heroku**.

Here are the simple steps to put your website online for free using Render:

### Step 1: Put your code on GitHub
1. Go to [GitHub.com](https://github.com/) and create a free account.
2. Download a program called "GitHub Desktop" to your computer.
3. Drag the folder containing your app into GitHub Desktop and click "Publish Repository" to send your code to GitHub.

### Step 2: Set up the Website (Frontend & Backend)
We will use a service called [Render.com](https://render.com/). It is very friendly for beginners!

1. Go to Render.com and sign up using your GitHub account.
2. Click the **"New"** button and select **"Web Service"**.
3. Render will show you a list of your GitHub projects. Select your health insurance checker project.
4. Fill in the following details:
   - **Name:** Choose a name (e.g., `aushealthcheck`)
   - **Environment:** Select `Node`
   - **Build Command:** Type `npm install && npx expo export --platform web`
   - **Start Command:** Type `npm run start-server` (This will start your brain/database).

### Step 3: Tell the Server where the Frontend is
Since Render only allows one command, we need the brain (Node.js server) to also serve the face (the React web files).

To do this, we've already set up the code so that if you run `npm run start-server`, the server will serve the files inside the `dist` folder!

5. Scroll down and click **Create Web Service**.

### Step 4: Wait for the Magic!
Render will now download your code, build the app, and give you a real website link (like `https://aushealthcheck.onrender.com`).

Once it says "Live", you can click the link and your website is ready! You can share this link with anyone.

### Need a Custom Domain Name?
If you want to use a nice name like `www.aushealthcheck.com.au`, you can buy one from a site like GoDaddy or Namecheap. Once you own it, you can go into your Render settings, click "Settings" -> "Custom Domains", and follow their instructions to link your new name to your website!
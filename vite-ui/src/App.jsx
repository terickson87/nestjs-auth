import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="497502121438-nps0pnk8f70nip05baosoppkpc63gt2b.apps.googleusercontent.com">
      <GoogleLogin
        buttonText="Login"
        onSuccess={(response) => {
          fetch('http://localhost:3000/authentication/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: response.credential,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App;

import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import shareVideo from '../assets/share.mp4';
import logoWhite from '../assets/logowhite.png';
import { client } from '../sanityClient'

const LoginPage = () => {
  const navigate = useNavigate()

  const responseMessage = (response) => {
    const decoded = jwt_decode(response.credential)
    localStorage.setItem('user', JSON.stringify(decoded))
    const { name, picture, sub } = decoded;
    
    const doc = {
      _id: sub,
      _type: 'user',
      username: name,
      image: picture,
    }

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true })
      })
  }

  const errorMessage = (error) => {
    console.log(error)
  }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video className="w-full h-full object-cover" src={shareVideo} type="video/mp4" loop controls={false} muted autoPlay/>

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logoWhite} width={130} alt="Logo sosial media" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin 
              onSuccess={responseMessage}
              onError={errorMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

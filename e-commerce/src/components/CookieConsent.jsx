import { useEffect, useState } from "react"

const CookieConsent = () => {
  // User cookie notification
  const [consent, setConsent] = useState(0);
  // İf user acceppt of the cookies local storage check
  useEffect(() => {
    const userConsent = localStorage.getItem('cookieConsent');
    if (userConsent === 'true') {
      setConsent(true)
    }
  }, [])
  // User first cookie notification
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setConsent(true)
  }
  // İf consent existing return null
  if (consent) {
    return null
  }

  return (
    <div style={styles.banner}>
      BWe use cookies to make your experience on our website as good as possible.a
      To learn more about how we use your data, please check out our  <a href="/privacy" style={styles.link}>privacy policy</a>.
      <button onClick={acceptCookies} style={styles.button}>Accept</button>
    </div>
  )
}

const styles = {
  banner: {
    position: `fixed`,
    bottom: '0',
    width: '100%',
    background: '#212529',
    color: '#8D8E90',
    padding: '30px 20px',
    textAlign: 'center',
    zIndex: '1000',
    fontSize: '14px',
  },
  button: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#4e503b',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'underline',
  },
}

export default CookieConsent
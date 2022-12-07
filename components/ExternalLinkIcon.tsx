// I thought there was a Unicode for this, but apparently it didn't work on my Mac. Either that or I found the wrong one 🤷‍♂️
// https://www.quora.com/Is-the-symbol-for-external-link-available-in-Unicode-If-so-how-do-I-get-in-on-my-Mac

export const ExternalLinkIcon = () =>
  <svg width="18px" height="18px" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
    <g strokeWidth="2.1" stroke="#666" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 13.5 17 19.5 5 19.5 5 7.5 11 7.5"></polyline>
      <path d="M14,4.5 L20,4.5 L20,10.5 M20,4.5 L11,13.5"></path>
    </g>
  </svg >
import './LoadingSpinner.css';

function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <span className="spinner-icon">🚌</span>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;

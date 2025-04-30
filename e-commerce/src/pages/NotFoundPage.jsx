import React from "react";

const NotFoundPage = () => {
    // İf failaure url request by user navigate to NotFoundPage 
    return (
        <div className="not-found-container">
            <div className="oops-text">Oops!</div>
            <div className="error-code">404 - PAGE NOT FOUND</div>
            <p className="error-message">
                The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
            </p>
            <a href="/" className="home-button">GO TO HOMEPAGE</a>
        </div>
    )
}

export default NotFoundPage
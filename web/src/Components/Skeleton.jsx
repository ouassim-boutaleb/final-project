import React from 'react';
import ContentLoader from 'react-content-loader';

export const EventsLoader = (props) => {
  // Determine the screen size and adjust the viewBox and dimensions accordingly
  const isSmallScreen = window.innerWidth <= 1024; // Small screens (e.g., mobile)
  const isMediumScreen = window.innerWidth > 1024 && window.innerWidth <= 1475; // Medium screens (e.g., tablets)
  const isLargeScreen = window.innerWidth > 1475; // Large screens (e.g., desktops)

  // Adjust the viewBox and dimensions based on screen size
  const viewBox = isSmallScreen
    ? '0 0 400 600' // Smaller viewBox for small screens
    : isMediumScreen
    ? '0 0 700 700' // Medium viewBox for tablets
    : '0 0 1000 300'; // Default viewBox for large screens

  return (
    <ContentLoader
      width="100%"
      height="100%"
      viewBox={viewBox}
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
      {...props}
    >
      {/* Adjusted rectangles for responsiveness */}
      {/* Large Screens */}
      {isLargeScreen && (
        <>
          <rect x="0" y="40" rx="16" ry="16" width="40%" height="600" />
          <rect x="53%" y="40" rx="3" ry="3" width="10%" height="10" />
          <rect x="53%" y="60" rx="3" ry="3" width="8%" height="10" />
        
          <rect x="53%" y="80" rx="3" ry="3" width="40%" height="4" />
          <rect x="53%" y="93" rx="3" ry="3" width="40%" height="4" />
          <rect x="53%" y="106" rx="3" ry="3" width="40%" height="4" />
          <rect x="53%" y="140" rx="3" ry="3" width="15%" height="7" />
          <rect x="53%" y="160" rx="3" ry="3" width="25%" height="6" />
          <rect x="53%" y="200" rx="14" ry="14" width="10%" height="32" />
        </>
      )}

      {/* Medium Screens */}
      {isMediumScreen && (
        <>
          <rect x="0" y="20" rx="16" ry="16" width="45%" height="250" />
          <rect x="50%" y="50" rx="3" ry="3" width="10%" height="7" />
          <rect x="50%" y="70" rx="3" ry="3" width="30%" height="4" />
          <rect x="50%" y="90" rx="3" ry="3" width="30%" height="4" />
          <rect x="50%" y="120" rx="3" ry="3" width="10%" height="7" />
          <rect x="50%" y="160" rx="3" ry="3" width="20%" height="7" />
          <rect x="50%" y="180" rx="3" ry="3" width="30%" height="6" />
          <rect x="50%" y="220" rx="14" ry="14" width="15%" height="32" />
        </>
      )}

      {/* Small Screens */}
      {isSmallScreen && (
         <>
         <rect x="0" y="20" rx="16" ry="16" width="100%" height="250" />
         
         <rect x="0" y="285" rx="3" ry="3" width="30%" height="10" />
         <rect x="0" y="310" rx="3" ry="3" width="70%" height="4" />
         <rect x="0" y="320" rx="3" ry="3" width="70%" height="4" />
         <rect x="0" y="330" rx="3" ry="3" width="50%" height="4" />
         <rect x="0" y="370" rx="3" ry="3" width="70%" height="6" />
         <rect x="0" y="400" rx="14" ry="14" width="30%" height="30" />
       </>
      )}
    </ContentLoader>
  );
};

export const MyLoader = (props) => {
  const small = window.innerWidth < 640 ? true : false;
  const viewBox = !small ? "0 0 400 400" : "0 0 100% 500";
  return(
   
  <ContentLoader 
    width="100%"
    height={small? 400 : 300}
    viewBox={viewBox}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {!small ? (
    <>
    <rect x="20" y="3" rx="0" ry="0" width="100%" height="270" /> 
    <rect x="145" y="290" rx="0" ry="0" width="119" height="6" /> 
    <rect x="170" y="308" rx="0" ry="0" width="64" height="9" /> 
    <rect x="164" y="330" rx="5" ry="5" width="76" height="30" /> 
    <rect x="20" y="398" rx="0" ry="0" width="100%" height="2" /> 
    <rect x="398" y="3" rx="0" ry="0" width="2" height="100%" /> 
    <rect x="20" y="3" rx="0" ry="0" width="2" height="100%" />
    </>
    ) :
    (
    <>
    <rect x="20" y="3" rx="0" ry="0" width="100%" height="270" /> 
    <rect x={`calc(50% - 60px )`} y="290" rx="0" ry="0" width="120" height="6" /> 
    <rect x={`calc(50% - 32px)`} y="308" rx="0" ry="0" width="64" height="9" /> 
    <rect x={`calc(50% - 38px)`} y="330" rx="5" ry="5" width="76" height="30" /> 
    <rect x="20" y="398" rx="0" ry="0" width="100%" height="2" /> 
    <rect x={`calc(100% - 2px)`} y="3" rx="0" ry="0" width="2" height="100%" /> 
    <rect x="20" y="3" rx="0" ry="0" width="2" height="100%" />
    </>
    )}

  </ContentLoader>
    
    
  
  )
}



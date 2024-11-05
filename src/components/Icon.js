// Icon.js
import React from 'react';

export const ProgressArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{ width: '32px', height: '32px' }}
  >
    <g transform="translate(0.5,0.5)">
      <path
        d="M 1.6 5.4 L 25.6 5.4 L 30.4 15 L 25.6 24.6 L 1.6 24.6 L 6.4 15 Z"
        fill="rgb(241, 243, 244)"
        stroke="rgb(0, 0, 0)"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
    </g>
  </svg>
);

export const Pentagon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{ width: '32px', height: '32px' }}
  >
    <g transform="translate(0.5,0.5)">
      <path
        d="M 7.03 28.05 L 1.5 11.52 L 16 1.95 L 30.5 11.52 L 24.97 28.05 Z"
        fill="none"
        stroke="rgb(0, 0, 0)"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
    </g>
  </svg>
);

export const Diamond = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{ width: '32px', height: '32px' }}
  >
    <g transform="translate(0.5,0.5)">
      <path
        d="M 16 1 L 30 16 L 16 31 L 2 16 Z"
        fill="none"
        stroke="rgb(0, 0, 0)"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
    </g>
  </svg>
);

export const Box = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{ width: '32px', height: '32px' }}
  >
    <g transform="translate(0.5,0.5)">
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        fill="none"
        stroke="rgb(0, 0, 0)"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
    </g>
  </svg>
);

export const Label = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{ width: '32px', height: '32px' }}
  >
    <g transform="translate(0.5,0.5)">
      <rect
        x="1"
        y="7.5"
        width="30"
        height="15"
        fill="none"
        stroke="rgb(0, 0, 0)"
        strokeWidth="1.3"
      />
      <text
        x="16"
        y="17.5"
        textAnchor="middle"
        fill="#000"
        fontSize="10"
        fontFamily="Helvetica"
      >
        Text
      </text>
    </g>
  </svg>
);

export const HeadingWithText = () => (
    <svg
      style={{
        left: '1px',
        top: '1px',
        width: '32px',
        height: '30px',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <g style={{ pointerEvents: 'none' }}>
        <g style={{ pointerEvents: 'none' }}></g>
        <g style={{ pointerEvents: 'none' }}>
          <g transform="translate(0.5,0.5)" style={{ visibility: 'visible', pointerEvents: 'none' }}>
            <rect
              x="1.6"
              y="5.16"
              width="28.8"
              height="19.2"
              fill="none"
              stroke="white"
              visibility="hidden"
              strokeWidth="9"
              style={{ pointerEvents: 'none' }}
            />
            <rect
              x="1.6"
              y="5.16"
              width="28.8"
              height="19.2"
              fill="none"
              stroke="none"
              style={{ pointerEvents: 'none' }}
            />
          </g>
          <g style={{ pointerEvents: 'none' }}>
            <g transform="scale(0.16)" style={{ pointerEvents: 'none' }}>
              <foreignObject width="625%" height="625%" style={{ overflow: 'visible', textAlign: 'left', pointerEvents: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '178px',
                    height: '1px',
                    paddingTop: '39px',
                    marginLeft: '12px',
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    data-drawio-colors="color: rgb(0, 0, 0);"
                    style={{
                      boxSizing: 'border-box',
                      fontSize: '0px',
                      textAlign: 'left',
                      maxHeight: '116px',
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '12px',
                        fontFamily: 'Helvetica',
                        color: 'rgb(0, 0, 0)',
                        lineHeight: '1.2',
                        pointerEvents: 'none',
                        whiteSpace: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <h1 style={{ marginTop: '0px', pointerEvents: 'none' }}>Heading</h1>
                      <p style={{ pointerEvents: 'none' }}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </foreignObject>
            </g>
          </g>
        </g>
        <g style={{ pointerEvents: 'none' }}></g>
        <g style={{ pointerEvents: 'none' }}></g>
      </g>
    </svg>
  );
export const  Ellipse= () => (
    <svg
      style={{
        left: '1px',
        top: '1px',
        width: '32px',
        height: '30px',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <g style={{ pointerEvents: 'none' }}>
        <g style={{ pointerEvents: 'none' }}>
          <g style={{ pointerEvents: 'none' }}>
            <g transform="translate(0.5,0.5)" style={{ visibility: 'visible', pointerEvents: 'none' }}>
              <ellipse
                cx="16"
                cy="15"
                rx="14.4"
                ry="9.6"
                fill="rgb(241, 243, 244)"
                stroke="rgb(0, 0, 0)"
                strokeWidth="1.3"
                style={{ pointerEvents: 'none' }}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );

 export const Parallelogram = () => (
    <svg style={{left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none'}}>
      <g style={{pointerEvents: 'none'}}>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}}>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 1.6 22.2 L 6.4 7.8 L 30.4 7.8 L 25.6 22.2 Z" fill="rgb(241, 243, 244)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
        </g>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}} />
      </g>
    </svg>
  );
  
  export const Hexagon = () => (
    <svg style={{left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none'}}>
      <g style={{pointerEvents: 'none'}}>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}}>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 6.4 5.4 L 25.6 5.4 L 30.4 15 L 25.6 24.6 L 6.4 24.6 L 1.6 15 Z" fill="rgb(241, 243, 244)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
        </g>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}} />
      </g>
    </svg>
  );
  
 export const Note = () => (
    <svg style={{left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none'}}>
      <g style={{pointerEvents: 'none'}}>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}}>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 5.2 1.5 L 18.7 1.5 L 26.8 9.6 L 26.8 28.5 L 5.2 28.5 L 5.2 1.5 Z" fill="rgb(241, 243, 244)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
            <path d="M 18.7 1.5 L 18.7 9.6 L 26.8 9.6 Z" fillOpacity="0.05" fill="#000000" stroke="none" style={{pointerEvents: 'none'}} />
            <path d="M 18.7 1.5 L 18.7 9.6 L 26.8 9.6" fill="none" stroke="white" strokeWidth="9.3" strokeMiterlimit="10" visibility="hidden" style={{pointerEvents: 'none'}} />
            <path d="M 18.7 1.5 L 18.7 9.6 L 26.8 9.6" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
        </g>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}} />
      </g>
    </svg>
  );
  

 export const Callout = () => (
    <svg style={{left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none'}}>
      <g style={{pointerEvents: 'none'}}>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}}>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 1.6 5.4 L 30.4 5.4 L 30.4 17.4 L 20.8 17.4 L 16 24.6 L 16 17.4 L 1.6 17.4 Z" fill="rgb(241, 243, 244)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
        </g>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}} />
      </g>
    </svg>
  );
  
 export const ConnectorWithSymbol = () => (
    <svg style={{left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none'}}>
      <g style={{pointerEvents: 'none'}}>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}}>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 3.38 14.88 L 26.78 14.88" fill="none" stroke="white" strokeWidth="9.3" strokeMiterlimit="10" visibility="hidden" style={{pointerEvents: 'none'}} />
            <path d="M 3.38 14.88 L 26.78 14.88" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
            <path d="M 28.1 14.88 L 26.35 15.75 L 26.78 14.88 L 26.35 14 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
          <g transform="translate(0.5, 0.5)" style={{visibility: 'visible', pointerEvents: 'none'}}>
            <path d="M 13.88 13.13 L 18.88 13.13 L 18.88 16.63 L 13.88 16.63 Z" fill="rgb(241, 243, 244)" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
            <path d="M 13.88 13.13 L 16.38 14.88 L 18.88 13.13" fill="none" stroke="white" strokeWidth="9.3" strokeMiterlimit="10" visibility="hidden" style={{pointerEvents: 'none'}} />
            <path d="M 13.88 13.13 L 16.38 14.88 L 18.88 13.13" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="1.3" strokeMiterlimit="10" style={{pointerEvents: 'none'}} />
          </g>
        </g>
        <g style={{pointerEvents: 'none'}} />
        <g style={{pointerEvents: 'none'}} />
      </g>
    </svg>
  );

  
 export const Line=()=>(
<svg style={{ left: '1px', top: '1px', width: '32px', height: '30px', display: 'block', position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
  <g style={{ pointerEvents: 'none' }}>
    <g style={{ pointerEvents: 'none' }}></g>
    <g style={{ pointerEvents: 'none' }}>
      <g transform="translate(0.5, 0.5)" style={{ visibility: 'visible', pointerEvents: 'none' }}>
        {/* Hidden white stroke path */}
        <path
          d="M 2.48 27.98 L 28.99 1.48"
          fill="none"
          stroke="white"
          strokeWidth="9.3"
          strokeMiterlimit="10"
          visibility="hidden"
          style={{ pointerEvents: 'none' }}
        />
        {/* Visible black stroke path */}
        <path
          d="M 2.48 27.98 L 28.99 1.48"
          fill="none"
          stroke="rgb(0, 0, 0)"
          strokeWidth="1.3"
          strokeMiterlimit="10"
          style={{ pointerEvents: 'none' }}
        />
      </g>
    </g>
    <g style={{ pointerEvents: 'none' }}></g>
    <g style={{ pointerEvents: 'none' }}></g>
  </g>
</svg>

  );
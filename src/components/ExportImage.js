import React from 'react'
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const ExportImage = () => {

    const domEl = useRef(null);

    const downloadImage = async () => {

        const filter = (node: HTMLElement) => {
            const exclusionClasses = ['remove-me', 'secret-div'];
            return !exclusionClasses.some((classname) => node.classList?.contains(classname));
        }

        const dataUrl = await htmlToImage.toPng(domEl.current, { quality: 1, filter: filter });

        // download image
        const link = document.createElement('a');
        // link.download = category + '(' + title + ')' + '.png';
        link.download = 'filename.png';
        link.href = dataUrl;
        link.click();
    };
    
    return (
        <>
            <svg className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" onClick={downloadImage} width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00064"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd" clipRule="evenodd"> <path d="M5.125.042c-2.801 0-5.072 2.273-5.072 5.074v53.841c0 2.803 2.271 5.073 5.072 5.073h45.775c2.801 0 5.074-2.271 5.074-5.073v-38.604l-18.904-20.311h-31.945z" fill="#49C9A7"></path> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#37BB91"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M10.119 53.739v-20.904h20.906v20.904h-20.906zm18.799-18.843h-16.691v12.6h16.691v-12.6zm-9.583 8.384l3.909-5.256 1.207 2.123 1.395-.434.984 5.631h-13.082l3.496-3.32 2.091 1.256zm-3.856-3.64c-.91 0-1.649-.688-1.649-1.538 0-.849.739-1.538 1.649-1.538.912 0 1.65.689 1.65 1.538 0 .85-.738 1.538-1.65 1.538z" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path> </g></svg>

        </>
    )
}

export default ExportImage
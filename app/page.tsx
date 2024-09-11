'use client'

import { useState, ChangeEvent } from 'react';
import Tesseract from 'tesseract.js';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle OCR process
  const handleConvertToText = (): void => {
    if (image) {
      setIsProcessing(true);
      Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m) => console.log(m),
        }
      )
        .then(({ data: { text } }) => {
          setText(text);
          setIsProcessing(false);
        })
        .catch((err) => {
          console.error(err);
          setIsProcessing(false);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Image to Text Converter</h1>
  
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md cursor-pointer"
        />
  
     
  
        {image && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Image</h2>
            <img
              src={image}
              alt="uploaded"
              className="w-full rounded-lg shadow-md object-contain"
            />
          </div>
        )}

        <button
          onClick={handleConvertToText}
          disabled={!image || isProcessing}
          className={`w-full py-2 px-4 font-semibold rounded-md text-white 
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-all duration-300`}
        >
          {isProcessing ? 'Processing...' : 'Convert to Text'}
        </button>
  
        {text && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Extracted Text</h2>
            <textarea
              value={text}
              readOnly
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
  
}

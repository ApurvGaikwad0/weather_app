import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p className="mb-2">Developed by Apurv Gaikwad</p>
      <p>
        PM Accelerator is a program designed to help aspiring product managers gain the skills and experience needed to succeed in their careers.{' '}
        <a
          href="https://www.linkedin.com/school/pmaccelerator/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Learn more on our LinkedIn page
        </a>.
      </p>
    </footer>
  );
};

export default Footer;
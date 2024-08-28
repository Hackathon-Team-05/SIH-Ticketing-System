import React from 'react';

function LanguageChooser({onSelectLanguage}) {
    const languages = [
        {code: 'en', name: 'English'},
        {code: 'hi', name: 'Hindi'},
        {code: 'or', name: 'Odia'}
    ];

    return (
        <div className="language-grid">
            {languages.map((language) => (
                <div
                    key={language.code}
                    className="language-item"
                    onClick={() => onSelectLanguage(language.code)}
                >
                    {language.name}
                </div>
            ))}


            <style jsx>{`
                .language-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    max-width: 300px;
                    margin: auto;
                }

                .language-item {
                    padding: 20px;
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    cursor: pointer;
                    background-color: #f5f5f5;
                    transition: background-color 0.3s;
                }

                .language-item:hover {
                    background-color: #e0e0e0;
                }
            `}</style>
        </div>
    );
}

export default LanguageChooser;

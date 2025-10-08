import React from "react";

const NewTaskHelper = () => {
  return (
    <div className="min-w-52 max-w-52">
      {/* Natural Language Parser */}
      <div>
        <h1 className="font-header mb-2">Natural Language Parser</h1>
        <p className="font-body">
          TuskTask featured NLP date parser, give it a try by typing:
        </p>
        <p className="font-body italic mt-2 p-2 border rounded-md">{`"Call Rizky tomorrow night"`}</p>
        <p className="font-body italic mt-2 p-2 border rounded-md">{`"Hiking preparation tomorrow at 3pm"`}</p>
        <p className="font-body italic mt-2 p-2 border rounded-md">{`"Meet with Asep 2 days after tomorrow at 6pm"`}</p>
      </div>
    </div>
  );
};

export default NewTaskHelper;

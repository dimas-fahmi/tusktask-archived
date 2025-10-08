import React from "react";
import { Separator } from "../../shadcn/components/ui/separator";

const NewTaskHelper = () => {
  return (
    <div className="min-w-52 max-w-52 py-4">
      {/* Natural Language Parser */}
      <div>
        <h1 className="font-header mb-2">Natural Language Parser</h1>
        <p className="font-body">
          TuskTask featured NLP date parser, give it a try by typing:
        </p>
        <p className="font-body text-xs mt-2 p-2 italic rounded-md">{`"Call Rizky tomorrow night"`}</p>
        <p className="font-body text-xs mt-2 p-2 italic rounded-md">{`"Hiking preparation tomorrow at 3pm"`}</p>
        <p className="font-body text-xs mt-2 p-1 italic rounded-md">{`"Meet with Asep 2 days after tomorrow at 6pm"`}</p>

        <Separator className="mt-4" />

        <small className="font-body mt-4 block">
          When you setup deadline manually, this feature is disabled untill you
          reset the field manually.
        </small>
      </div>
    </div>
  );
};

export default NewTaskHelper;

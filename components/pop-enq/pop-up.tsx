"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import EnquiryForm from "./enq-pop-form";

const EnquiryPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[95vw] mx-auto rounded-lg shadow-lg">
          <DialogHeader></DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto">
            <EnquiryForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiryPopup;

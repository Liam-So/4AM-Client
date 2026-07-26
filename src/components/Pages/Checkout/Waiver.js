import React, { useState, useRef } from "react";

// The waiver text itself, pulled from the club's official waiver document.
// Kept as plain paragraphs here so it's easy to update if the waiver
// wording changes in future years.
const WAIVER_PARAGRAPHS = [
  "WAIVER OF LIABILITY FOR ALL CLAIMS AND RELEASE OF LIABILITY",
  "PLEASE READ CAREFULLY BEFORE SIGNING.",
  "Completed waivers must be returned with registration or prior to attending the Organizer\u2019s event: The 4AM Camp (the \u201cEvent\u201d).",
  "For the purposes of this Waiver, \u201cOrganization\u201d means 4AM Basketball Society, and their respective directors, officers, coaches, representatives, and volunteers.",
  "By signing below, the Participant and/or the Participant\u2019s Guardian understands, acknowledges, and assumes the inherent risks in participating in the Event, including, but not limited to: the potential for bodily injury or illness; permanent disability; paralysis; loss of life; collision with natural or manmade objects; inadequate safety measures; dangers arising from adverse weather conditions; imperfect venue or field of play conditions; equipment failure; participants of varying skill levels; basketball-related contact, running, jumping, cutting, falling, collisions, overexertion, and other physical exertion; circumstances known, unknown, or beyond the control of the Organizer; and negligence, acts, or omissions of the Organization (collectively, the \u201cRisks\u201d). The Participant and/or the Participant\u2019s Guardian further acknowledges that the Participant is physically capable of participating in the Event and that any known medical conditions that may affect participation have been disclosed to the Organization.",
  "In the event of illness or injury, the Participant\u2019s Guardian authorizes the Organization to secure such medical advice, treatment, or emergency transportation as may be deemed necessary for the Participant\u2019s health and safety. The Participant\u2019s Guardian understands and agrees that all costs associated with such medical advice, treatment, or emergency transportation are the sole responsibility of the Participant\u2019s Guardian.",
  "In consideration for allowing the Participant to participate in the Event, the Participant and/or the Participant\u2019s Guardian: (a) release, discharge, and forever hold harmless the Organization from any and all liability for damages or loss arising as a result of the Risks of participation in or in connection with the Event; (b) waive any right to sue the Organization in respect of all causes of action, including for injuries or illness caused by the Organization\u2019s negligence, acts, or omissions, claims, demands, damages, or losses of any kind that may arise as a result of the Risks of participation in or in connection with the Event, including without limitation the right to make a third-party claim or claim over against the Organization arising from the same; and (c) freely assumes all risks associated with the Risks, and anything incidental to the Risks, which may arise as a result of participation in or in connection with the Event. YOU ARE GIVING UP LEGAL RIGHTS TO ANY AND ALL FUTURE CLAIMS AGAINST THE ORGANIZATION.",
  "The Participant\u2019s Guardian consents to the use of photographs, video recordings, and other media containing the Participant\u2019s image for promotional, educational, and administrative purposes of the Organization, without compensation.",
  "This Waiver shall be governed by and interpreted in accordance with the laws of the Province of Nova Scotia and the laws of Canada applicable therein.",
  "If any provision of this Waiver is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
  "The Participant\u2019s Guardian represents and warrants that he or she is the parent or legal guardian of the Participant and has the legal authority to execute this Waiver and Release on the Participant\u2019s behalf.",
  "The Participant and/or the Participant\u2019s Guardian confirms that he or she has read and fully understands this Waiver and Release of Liability. The Participant and/or the Participant\u2019s Guardian signs this Waiver voluntarily and without any inducement, assurance, or warranty being made to them.",
];

export const todayFormatted = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
};

const inputClasses =
  "w-full max-w-md border-b-2 border-gray-200 focus:border-brand outline-none py-2 px-1 text-gray-800 transition-colors bg-transparent";

function Waiver({ waiverData, onChange, onBack, onNext }) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [scrollWarning, setScrollWarning] = useState(false);
  const [errors, setErrors] = useState({});
  const scrollBoxRef = useRef(null);

  const handleScroll = () => {
    const el = scrollBoxRef.current;
    if (!el) return;
    const reachedBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    if (reachedBottom) {
      setHasScrolledToEnd(true);
      setScrollWarning(false);
    }
  };

  const handleCheckboxClick = (e) => {
    if (!hasScrolledToEnd) {
      // The checkbox isn't actually disabled (a disabled input suppresses
      // the click event entirely, so we'd never see this attempt) --
      // instead we just cancel the toggle ourselves and show the warning.
      e.preventDefault();
      setScrollWarning(true);
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === "waiverAgreed" ? e.target.checked : e.target.value;
    onChange(field, value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!waiverData.waiverAgreed) {
      newErrors.waiverAgreed = "You must agree to the waiver to continue.";
    }
    if (!waiverData.parentGuardianName || !waiverData.parentGuardianName.trim()) {
      newErrors.parentGuardianName = "This field is required.";
    }
    if (!waiverData.waiverDate || !waiverData.waiverDate.trim()) {
      newErrors.waiverDate = "This field is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Event Participation Waiver
      </h3>

      <div
        ref={scrollBoxRef}
        onScroll={handleScroll}
        className="border border-gray-300 rounded p-4 h-72 overflow-y-auto bg-gray-50 text-sm text-gray-700 leading-relaxed space-y-3"
      >
        {WAIVER_PARAGRAPHS.map((para, i) => (
          <p key={i} className={i < 2 ? "font-semibold" : ""}>
            {para}
          </p>
        ))}
      </div>

      {!hasScrolledToEnd && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Please scroll to the bottom of the waiver to continue.
        </p>
      )}

      <div className="border-b border-gray-200 py-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!waiverData.waiverAgreed}
            onClick={handleCheckboxClick}
            onChange={handleChange("waiverAgreed")}
            style={{ accentColor: "#d64339" }}
            className={
              "w-5 h-5 mt-0.5 flex-shrink-0" +
              (hasScrolledToEnd ? "" : " opacity-50 cursor-not-allowed")
            }
          />
          <span className="text-gray-900">
            I am the parent/legal guardian and I agree to the waiver
          </span>
        </label>
        {scrollWarning && !hasScrolledToEnd && (
          <p className="text-red-500 text-sm mt-2">
            Please scroll to the bottom of the waiver to continue.
          </p>
        )}
        {errors.waiverAgreed && (
          <p className="text-red-500 text-sm mt-2">{errors.waiverAgreed}</p>
        )}
      </div>

      <div className="border-b border-gray-200 py-6">
        <label className="block text-gray-900 font-medium text-base md:text-lg">
          Parent/Guardian Name<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="mb-3" />
        <input
          type="text"
          className={inputClasses}
          value={waiverData.parentGuardianName || ""}
          onChange={handleChange("parentGuardianName")}
        />
        {errors.parentGuardianName && (
          <p className="text-red-500 text-sm mt-2">{errors.parentGuardianName}</p>
        )}
      </div>

      <div className="py-6">
        <label className="block text-gray-900 font-medium text-base md:text-lg">
          Date<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="mb-3" />
        <input
          type="text"
          className={inputClasses + " max-w-xs"}
          placeholder="MM/DD/YYYY"
          value={waiverData.waiverDate || ""}
          onChange={handleChange("waiverDate")}
        />
        {errors.waiverDate && (
          <p className="text-red-500 text-sm mt-2">{errors.waiverDate}</p>
        )}
      </div>

      <div className="pt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 underline text-sm"
        >
          Back to Registration Form
        </button>
        <button
          type="submit"
          className="bg-brand hover:bg-brand-dark text-white font-medium py-3 px-8 rounded"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

export default Waiver;

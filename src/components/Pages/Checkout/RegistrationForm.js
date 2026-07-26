import React, { useState } from "react";

const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const GRADES = ["10", "11", "12"];

// A single question block: bold label on top, smaller/lighter subtext
// directly below it, then the input. This mirrors the Google Forms layout
// the site is meant to imitate.
function Field({ label, subtext, required, error, children }) {
  return (
    <div className="border-b border-gray-200 py-6 first:pt-0 last:border-b-0">
      <label className="block text-gray-900 font-medium text-base md:text-lg">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {subtext && (
        <p className="text-gray-400 text-xs md:text-sm mt-1 mb-3">{subtext}</p>
      )}
      {!subtext && <div className="mb-3" />}
      {children}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

const inputClasses =
  "w-full max-w-md border-b-2 border-gray-200 focus:border-blue-600 outline-none py-2 px-1 text-gray-800 transition-colors bg-transparent";

function RegistrationForm({ formData, onChange, tshirtSubtext, onSubmit }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "athleteName",
    "grade",
    "school",
    "team",
    "email",
    "emergencyContactName",
    "emergencyContactPhone",
    "tshirtSize",
  ];

  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    } else {
      // Scroll to the top of the form so the visitor sees what needs fixing.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Field label="Athlete's Name (First and Last)" required error={errors.athleteName}>
        <input
          type="text"
          className={inputClasses}
          value={formData.athleteName || ""}
          onChange={handleChange("athleteName")}
        />
      </Field>

      <Field label="Grade (starting in Sept.)" required error={errors.grade}>
        <select
          className={inputClasses + " max-w-xs bg-white"}
          value={formData.grade || ""}
          onChange={handleChange("grade")}
        >
          <option value="" disabled>
            Select grade
          </option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>

      <Field label="School" required error={errors.school}>
        <input
          type="text"
          className={inputClasses}
          value={formData.school || ""}
          onChange={handleChange("school")}
        />
      </Field>

      <Field label="Team Most Recently Played On" required error={errors.team}>
        <input
          type="text"
          className={inputClasses}
          value={formData.team || ""}
          onChange={handleChange("team")}
        />
      </Field>

      <Field
        label="Email Address"
        subtext="Please use an email address that you check often, as we will be sending important camp information to this email address the week leading up to the camp."
        required
        error={errors.email}
      >
        <input
          type="email"
          className={inputClasses}
          value={formData.email || ""}
          onChange={handleChange("email")}
        />
      </Field>

      <Field label="Emergency Contact Name" required error={errors.emergencyContactName}>
        <input
          type="text"
          className={inputClasses}
          value={formData.emergencyContactName || ""}
          onChange={handleChange("emergencyContactName")}
        />
      </Field>

      <Field
        label="Emergency Contact Phone Number"
        required
        error={errors.emergencyContactPhone}
      >
        <input
          type="tel"
          className={inputClasses}
          value={formData.emergencyContactPhone || ""}
          onChange={handleChange("emergencyContactPhone")}
        />
      </Field>

      <Field label="T-Shirt Size" subtext={tshirtSubtext} required error={errors.tshirtSize}>
        <select
          className={inputClasses + " max-w-xs bg-white"}
          value={formData.tshirtSize || ""}
          onChange={handleChange("tshirtSize")}
        >
          <option value="" disabled>
            Select size
          </option>
          {TSHIRT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Please let us know if you have any additional comments for us (e.g., can't attend Session #3, etc.).">
        <textarea
          className={inputClasses + " resize-none"}
          rows={3}
          value={formData.comments || ""}
          onChange={handleChange("comments")}
        />
      </Field>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded"
        >
          Next: Payment
        </button>
      </div>
    </form>
  );
}

export default RegistrationForm;

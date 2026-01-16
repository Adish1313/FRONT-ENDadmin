import { useState } from "react";
import { apiCallPost } from "../../api/axios";
import { toasts } from "../../component/common/ui/Toast/Toast";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
}

const VerifyOtpModal = ({
  isOpen,
  onClose,
  onVerifySuccess,
}: VerifyOtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toasts.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    // const res = await apiCallPost("/auth/verify-otp", { otp }, {}, true);

    setLoading(false);

    // if (res?.success) {
    onVerifySuccess();
    onClose();
    // }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

        <input
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="border w-full p-2 mb-4 text-center tracking-widest text-lg rounded"
          placeholder="Enter OTP"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpModal;

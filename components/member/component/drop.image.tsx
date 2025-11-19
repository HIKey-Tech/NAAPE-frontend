import React, { useRef, useState } from "react";

// Define theme variables for easy reuse and consistency
const COLORS = {
  background: "#fff",
  border: "#b9cdf1",
  borderHighlight: "#7591e6",
  iconBg: "#FFF5E0",
  iconRect: "#FFE7B2",
  iconRectStroke: "#FFD580",
  iconCircle: "#FFA602",
  iconDetail: "#FFCE73",
  text: "#585858",
  subText: "#757575",
};

const dropImageStyle: React.CSSProperties = {
  background: COLORS.background,
  border: `2px dashed ${COLORS.border}`,
  borderRadius: "14px",
  minHeight: "210px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  transition: "border 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  boxShadow: "0 2px 6px 0 rgba(185, 205, 241, 0.07)",
};

const defaultIcon = (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <rect width="54" height="54" rx="12" fill={COLORS.iconBg} />
    <g filter="url(#icon_dropshadow)">
      <rect x="12" y="14" width="30" height="26" rx="4" fill={COLORS.iconRect} />
      <rect x="12.5" y="14.5" width="29" height="25" rx="3.5" stroke={COLORS.iconRectStroke} />
    </g>
    <circle cx="19.5" cy="21.5" r="2.5" fill={COLORS.iconCircle} />
    <path
      d="M14 36l6.881-8.13c1.572-1.855 4.409-1.855 5.981 0l8.607 10.163c1.384 1.634 4.08 1.015 4.08-1.037V18a4 4 0 00-4-4H16a4 4 0 00-4 4v20a2 2 0 003.246 1.617z"
      fill={COLORS.iconDetail}
      fillOpacity=".4"
    />
    <defs>
      <filter id="icon_dropshadow" x="10" y="12" width="34" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
      </filter>
    </defs>
  </svg>
);

const FILE_TYPES = [
  {
    label: "Image Upload",
    accept: ".jpg,.jpeg,.png,.gif,.webp",
    maxSizeMB: 10,
    maxFiles: 1,
    isImage: true,
    icon: defaultIcon,
    message: (
      <>
        <div><strong>Image:</strong> Minimum 800px width recommended</div>
        <div style={{ fontSize: "12px", color: COLORS.subText }}>Max 10MB each. JPEG/JPG/PNG supported.</div>
      </>
    ),
  },
  {
    label: "PDF Upload",
    accept: ".pdf",
    maxSizeMB: 10,
    maxFiles: 1,
    isImage: false,
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
        <rect width="54" height="54" rx="12" fill="#EDF5FB" />
        <g filter="url(#icon_pdf_shadow)">
          <rect x="15" y="12" width="24" height="30" rx="4" fill="#E0EDFC"/>
          <rect x="15.5" y="12.5" width="23" height="29" rx="3.5" stroke="#97B9D6"/>
        </g>
        <rect x="19" y="18" width="16" height="2" rx="1" fill="#87B4DC" />
        <rect x="19" y="23" width="10" height="2" rx="1" fill="#A9CCE9" />
        <rect x="19" y="28" width="12" height="2" rx="1" fill="#A9CCE9" />
        <text x="21" y="40" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#87B4DC">PDF</text>
        <defs>
          <filter id="icon_pdf_shadow" x="13" y="10" width="28" height="34" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
          </filter>
        </defs>
      </svg>
    ),
    message: (
      <>
        <div><strong>PDF:</strong> Max 10MB</div>
      </>
    ),
  },
];

type DropImageInfoProps = {
  icon?: React.ReactNode;
  message: React.ReactNode;
  label?: string;
  onFileChange: (files: FileList | null) => void;
  accept: string;
  multiple?: boolean;
  files?: File[] | null;
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
};

const DropImageInfo: React.FC<DropImageInfoProps> = ({
  icon = defaultIcon,
  message,
  label,
  onFileChange,
  accept,
  multiple,
  files,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Render preview if image
  const renderPreview = () => {
    if (!files || files.length === 0) return null;
    // Only preview the first file
    const file = files[0];
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          style={{
            maxWidth: 120,
            maxHeight: 100,
            margin: "8px auto 8px auto",
            display: "block",
            borderRadius: 8,
            boxShadow: "0 1px 6px 0 rgba(36,57,138,0.10)",
          }}
        />
      );
    }
    // For PDFs, maybe show a file icon
    return (
      <div
        style={{
          fontSize: 12,
          margin: "8px auto 8px auto",
          color: COLORS.text,
        }}
      >
        {file.name}
      </div>
    );
  };

  return (
    <div
      style={{
        ...dropImageStyle,
        border: dragActive
          ? `2.5px solid ${COLORS.borderHighlight}`
          : dropImageStyle.border,
        background: dragActive ? "#F7FAFF" : dropImageStyle.background,
      }}
      tabIndex={0}
      onClick={handleClick}
      onDrop={e => {
        e.preventDefault();
        e.stopPropagation();
        onFileChange(e.dataTransfer.files);
      }}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        accept={accept}
        multiple={!!multiple}
        onChange={e => onFileChange(e.target.files)}
      />
      <div style={{ marginBottom: 16 }}>
        {icon}
      </div>
      {label && (
        <div style={{
          fontWeight: 600,
          fontSize: "15px",
          color: COLORS.text,
          marginBottom: 6,
          textAlign: "center",
        }}>
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: "13px",
          color: COLORS.subText,
          textAlign: "center",
          width: "92%",
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>
      {renderPreview()}
      {files && files.length > 0 && (
        <div
          style={{
            fontSize: 12,
            color: COLORS.text,
            marginTop: 8,
            textAlign: "center"
          }}
        >
          <strong>Selected:</strong> {files[0].name}
        </div>
      )}
      <div style={{
        marginTop: 12,
        background: "#F0F8FF",
        fontSize: 12,
        color: COLORS.text,
        borderRadius: 4,
        padding: "2px 8px",
        display: dragActive ? "inline-block" : "none",
      }}>
        Drop to upload
      </div>
    </div>
  );
};

export default function DropImageDual() {
  // Each type gets its own file state
  const [imageFile, setImageFile] = useState<File[] | null>(null);
  const [pdfFile, setPdfFile] = useState<File[] | null>(null);

  // Drag active state for each dropzone
  const [dragImage, setDragImage] = useState(false);
  const [dragPdf, setDragPdf] = useState(false);

  // Event handlers for drag-and-drop (separate per dropzone)
  const getHandlers = (
    setDrag: React.Dispatch<React.SetStateAction<boolean>>,
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>,
    maxSizeMB: number,
    accept: string[],
    isImage: boolean
  ) => {
    return {
      onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setDrag(true);
      },
      onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setDrag(false);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
      },
      onFileChange: (fileList: FileList | null) => {
        setDrag(false);
        if (!fileList || fileList.length === 0) return;
        const file = fileList[0];

        // Check type and size
        const validType = accept.some(type =>
          file.name.toLowerCase().endsWith(type.replace('.', ''))
          || file.type === type
        );
        if (!validType && accept.length > 0) {
          alert(`File type not supported.\nSupported: ${accept.join(', ')}`);
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File size too large. Max ${maxSizeMB}MB allowed.`);
          return;
        }
        setFiles([file]);
      }
    };
  };

  const imageAcceptExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const pdfAcceptExts = [".pdf"];

  const imageHandlers = getHandlers(setDragImage, setImageFile, 10, imageAcceptExts, true);
  const pdfHandlers = getHandlers(setDragPdf, setPdfFile, 10, pdfAcceptExts, false);

  const imageAcceptString = imageAcceptExts.join(",");
  const pdfAcceptString = pdfAcceptExts.join(",");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px",
        width: "100%",
      }}
    >
      <DropImageInfo
        icon={FILE_TYPES[0].icon}
        label={FILE_TYPES[0].label}
        message={FILE_TYPES[0].message}
        accept={imageAcceptString}
        onFileChange={imageHandlers.onFileChange}
        multiple={false}
        files={imageFile}
        dragActive={dragImage}
        onDragEnter={imageHandlers.onDragEnter}
        onDragLeave={imageHandlers.onDragLeave}
        onDragOver={imageHandlers.onDragOver}
      />
      <DropImageInfo
        icon={FILE_TYPES[1].icon}
        label={FILE_TYPES[1].label}
        message={FILE_TYPES[1].message}
        accept={pdfAcceptString}
        onFileChange={pdfHandlers.onFileChange}
        multiple={false}
        files={pdfFile}
        dragActive={dragPdf}
        onDragEnter={pdfHandlers.onDragEnter}
        onDragLeave={pdfHandlers.onDragLeave}
        onDragOver={pdfHandlers.onDragOver}
      />
    </div>
  );
}

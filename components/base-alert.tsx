"use client";

export default function BaseAlert({ 
  alert
}: {
  alert: { 
    type: string; 
    message: string; 
  }
}){
  function getVariantClasses(type: string) {
    switch(type) {
      case "info":
        return {
          text: "text-blue-800",
          border: "border-blue-300",
          bg: "bg-blue-50"
        };
      case "success":
        return {
          text: "text-green-800",
          border: "border-green-300",
          bg: "bg-green-50"
        };
      case "warning":
        return {
          text: "text-yellow-800",
          border: "border-yellow-300",
          bg: "bg-yellow-50"
        };
      case "error":
        return {
          text: "text-red-800",
          border: "border-red-300",
          bg: "bg-red-50"
        };
      default:
        return {
          text: "text-gray-800",
          border: "border-gray-300",
          bg: "bg-gray-50"
        };
    }
  }

  const variantClasses = getVariantClasses(alert?.type);

  return(
    <div className={`flex items-center p-4 mb-4 text-sm ${variantClasses.text} ${variantClasses.border} rounded-lg ${variantClasses.bg}`} role="alert">
      <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">{alert.message}</span>
      </div>
    </div>
  )
}
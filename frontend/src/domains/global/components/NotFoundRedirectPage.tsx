import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundRedirectPage(){
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/sign", { replace: true });
  }, [navigate]);

  return null;
};

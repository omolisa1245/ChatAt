import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const FloatingButton = () => {
  return (
    <TouchableOpacity
      className="absolute bottom-15 right-5 w-14 h-14 rounded-full bg-blue-500 items-center justify-center z-50"
      style={{ elevation: 10 }}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default FloatingButton;
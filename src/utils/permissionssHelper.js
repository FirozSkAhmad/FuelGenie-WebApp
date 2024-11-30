import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export const usePermissions = () => {
    const { user } = useContext(AuthContext); // Get user data from context
    const location = useLocation(); // Get the current path

    if (!user) return null;

    // Check if the user has an "ADMIN" role
    const isAdmin = user.teamAndRole?.some((team) =>
        team.roles?.some((role) => role.roleName === "ADMIN")
    );

    // If the user is an admin, grant full permissions
    if (isAdmin) {
        return {
            create: true,
            read: true,
            update: true,
            delete: true,
        };
    }

    // If not an admin, calculate permissions based on sections and path
    if (!user.sections) return null;

    const currentPath = location.pathname; // e.g., "/products/zone-prod-mgr"
    const pathSegments = currentPath.split("/").filter(Boolean);
    const [currentModule, currentSubModule] = pathSegments;

    // Find the module in the user's sections
    const module = user.sections.find(
        (section) => section.moduleName === currentModule
    );

    if (!module) return null;

    // Find the submodule in the module's subModules
    const subModule = module.subModules.find(
        (sub) => sub.subModuleName === currentSubModule
    );

    return subModule ? subModule.permissions : null;
};

// utils/checkAccess.js

export const checkAccess = (userData, requiredModule, requiredSubModule) => {
    // Check if userData exists
    if (!userData) {
        console.log("No user data provided");
        return false;
    }

    // Check if the user has the 'ADMIN' role
    const isAdmin = userData?.teamAndRole?.some((team) =>
        team.roles?.some((role) => role.roleName === "ADMIN")
    );
    console.log("Is Admin:", isAdmin);  // Log the admin status for debugging

    // If the user is an admin, grant access
    if (isAdmin) {
        return true;
    }
    // Check if the user has access to the required module and submodule
    const hasAccess = userData?.sections?.some((section) =>
        section.moduleName === requiredModule &&
        section.subModules?.some((sub) =>
            sub.subModuleName === requiredSubModule
        )
    );
    console.log(`User has access to ${requiredModule}/${requiredSubModule}:`, hasAccess);  // Log access check for debugging

    return hasAccess;  // Return true if the user has access, otherwise false
};

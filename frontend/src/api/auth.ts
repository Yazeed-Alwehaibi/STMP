export const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        credentials: "include", // Required for cookie-based authentication
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};

export const logoutUser = async () => {
    await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
    });
};

export const getProfile = async () => {
    const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        credentials: "include",
    });

    return response.json();
};

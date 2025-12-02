import prisma from "../../../models/prismaClient.js";

const getUserProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.message || "Failed to fetch user profile");
  }
};

const updateUserProfile = async (userId, profileData, file) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        email: profileData.email,
        profilePic: file ? `/uploads/profilepics/${file.filename}` : undefined,
      },
    });

    await prisma.log.create({
      data: {
        userId: userId,
        action: "controls submitted",
      },
    });
    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(error.message || "Failed to update user profile");
  }
};

export default { getUserProfile, updateUserProfile };

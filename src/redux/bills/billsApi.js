import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "http://localhost:5000/users";

// Get User Bills History
const getUserBillsHistory = async (userId) => {
  try {
    const response = await axios.get(`${URL}/${userId}`);
    return response.data.billsHistory || [];
  } catch (error) {
    console.error("Error fetching user bills history:", error);
    return [];
  }
};

export const useUserBillsHistory = (userId) => {
  return useQuery({
    queryKey: ["userBillsHistory", userId],
    queryFn: () => getUserBillsHistory(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// Add a bill to User Bills History and remove purchased items from cart
const addBillToUserHistory = async ({ userId, newBill }) => {
  try {
    // 1. Get the user's current data
    const userResponse = await axios.get(`${URL}/${userId}`);
    const user = userResponse.data;

    // 2. Update the user's billsHistory array
    const updatedBillsHistory = [...user.billsHistory, newBill];

    // 3. Remove the purchased products from the user's cart
    const purchasedProductIds = newBill.products.map((product) => product.id); // Assuming each product has an 'id'
    const updatedCart = user.cartInfo.cart.filter((cartItem) => !purchasedProductIds.includes(cartItem.product.id));

    // 4. Calculate the new total price of the cart
    const newTotalPrice = updatedCart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.quantity, 0);

    // 5. Update the user in the database with new billsHistory and updated cart
    const response = await axios.patch(`${URL}/${userId}`, {
      billsHistory: updatedBillsHistory,
      cartInfo: {
        cart: updatedCart,
        isEmpty: updatedCart.length === 0,
        totalPrice: newTotalPrice,
      },
    });

    return response.data; // Return the updated user data
  } catch (error) {
    console.error("Error adding bill to user history:", error);
    throw error;
  }
};

export const useAddBillToUserHistory = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBill) => addBillToUserHistory({ userId, newBill }),
    onSuccess: () => {
      // Invalidate the userBillsHistory query to refetch the updated data
      queryClient.invalidateQueries(["userBillsHistory", userId]);
      // Invalidate the cart query to refetch the updated cart data
      queryClient.invalidateQueries(["cart", userId]);
    },
    onError: (error) => {
      console.error("Failed to add bill to user history:", error);
      // Optionally, display an error message to the user
    },
  });
};

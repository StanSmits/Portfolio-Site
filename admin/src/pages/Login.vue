<template>
  <div
    class="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
  >
    <div
      class="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8 opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards"
    >
      <div class="text-white">
        <div class="mb-8 flex flex-col items-center">
          <h1 class="mb-2 text-2xl">Stan Smits admin panel</h1>
          <span class="text-gray-300">stop met spieken</span>
        </div>
        <div class="mb-4 text-lg">
          <input
            class="rounded-3xl border-none bg-purple-500 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
            type="text"
            name="name"
            placeholder="username"
            v-model="username"
          />
        </div>

        <div class="mb-4 text-lg">
          <input
            class="rounded-3xl border-none bg-purple-500 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
            type="Password"
            name="name"
            placeholder="*********"
            v-model="password"
          />
        </div>
        <div class="mt-8 flex justify-center text-lg text-black">
          <button
            type="submit"
            class="rounded-3xl bg-purple-500 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-purple-700"
            @click="login"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// When the user clicks on the login button, the login function is called
// The login function calls the login endpoint and passes the username and password
// The login endpoint returns a JWT token
// The JWT token is stored in the local storage
// The user is redirected to the home page
// The request will be intercepted by the auth interceptor and the JWT token will be added to the request header
// The request will be made by axios

import axios from "../interceptor/http.interceptor";
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const { username, password } = {
        username: this.username,
        password: this.password,
      };

      if (!username || !password) {
        toast.error("Please enter username and password");
      }

      await axios
        .post("https://stansmits.nl/api/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          toast.success("Login successful");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
          switch (err.response.status) {
            case 400:
              toast.error("Login failed: You are missing a field");
              break;
            case 403:
              toast.error("Login failed: Incorrect password");
              break;
            case 404:
              toast.error("Login failed: User not found");
              break;
            case 500:
              toast.error("Login failed: Server error");
              break;
            default:
              toast.error("Login failed: Unknown error");
          }
        });
    },
  },
};
</script>

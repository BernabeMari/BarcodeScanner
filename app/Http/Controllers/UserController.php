<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function login_page(){
        return inertia('Login/Index');
    }

    public function create_user(Request $request){
        $create_user = $request->validate([
            'username' => 'required',
            'password' => 'required',
            'role' => 'required',
            'department' => 'nullable|string',
            'profile_picture' => 'nullable'
        ]);

        if ($create_user['role'] === 'admin') {
            $create_user['department'] = null;
        }

        User::create($create_user);
        return redirect()->back();
    }

    public function login(Request $request){
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if(Auth::attempt($credentials)){
            $request->session()->regenerate();
            $user = Auth::user();
            if ($user->role === 'admin') {
                return redirect()->route('admin_page');
            } elseif ($user->role === 'employee') {
                return redirect()->route('employee_page');
            }
            return redirect()->route('login_page');
        }

        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ]);
    }

    public function updateProfile(Request $request){
        $find = User::findOrFail(Auth::user()->id);     
        $find->update([
            'profile_picture' => $request->file('profile_picture')->store('profile_picture', 'public')
        ]);

        return redirect()->back();
    }
}

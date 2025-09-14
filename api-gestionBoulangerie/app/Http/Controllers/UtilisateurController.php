<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\User;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $utilisateurs = User::all();
        return response()->json($utilisateurs);
    }

    /**
     * Store a newly created resource in storage.
     */


    /**
     * Display the specified resource.
     */
    public function show( User $utilisateur)
    {
        return response()->json($utilisateur, 200);
    }

    /**
     * Update the specified resource in storage.
     */
  public function store(Request $request)
{
    $validated = $request->validate([
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8',
        'role' => 'required|string',
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // <--- ici image
        'telephone' => 'nullable|string|max:15',
        'adresse' => 'nullable|string|max:255',
     ]);

    // Upload fichier si présent
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('photos', 'public');
        $validated['photo'] = $path; // chemin dans la DB
    }

    $validated['password'] = bcrypt($validated['password']);

    $utilisateur = User::create($validated);
    return response()->json($utilisateur, 201);
}

public function update(Request $request, User $utilisateur)
{
    $validated = $request->validate([
        'prenom' => 'sometimes|required|string|max:255',
        'nom' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:users,email,' . $utilisateur->id,
        'password' => 'sometimes|nullable|string|min:8',
        'role' => 'sometimes|required|string',
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'telephone' => 'nullable|string|max:15',
        'adresse' => 'nullable|string|max:255',
     ]);

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('photos', 'public');
        $validated['photo'] = $path;
    }

    if (!empty($validated['password'])) {
        $validated['password'] = bcrypt($validated['password']);
    } else {
        unset($validated['password']);
    }

    // Supprimer les champs vides du tableau pour ne pas écraser
    $validated = array_filter($validated, fn($value) => $value !== null && $value !== '');

    $utilisateur->update($validated);
    return response()->json($utilisateur, 200);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $utilisateur)
    {
        $utilisateur->delete();
        return response()->json(null, 204);
    }

    public function changerRole(Request $request, $id)
{
    $utilisateur = User::findOrFail($id);

    $validated = $request->validate([
        'role' => 'required|string|in:ADMIN,CLIENT,GESTIONNAIRE'
    ]);

    $utilisateur->update(['role' => $validated['role']]);

    return response()->json($utilisateur, 200);
}
}

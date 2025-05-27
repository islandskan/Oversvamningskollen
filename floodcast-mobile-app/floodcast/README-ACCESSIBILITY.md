# Accessibility at FloodCast

At FloodCast, we're committed to building an inclusive app experience for everyone. This guide highlights the accessibility practices already in place and how they align with **WCAG 2.1 AA** guidelines. These implementations provide a strong foundation for ensuring our app is usable, understandable, and robust for all users.

---

## ✅ What’s Working Well

### 1. **Accessible Buttons**
**Where:** `ActionButton`, `Location Center Button`  
**What’s great:**
- Clear `accessibilityLabel` and helpful `accessibilityHint`
- Proper role declaration with `accessibilityRole="button"`
- Large, easy-to-tap touch targets
- Visual and tactile feedback on interaction

---

### 2. **Modals with Screen Reader Support**
**Where:** `FloodRiskModal`, `CustomAlert`  
**What’s great:**
- Uses `accessibilityViewIsModal={true}` to focus screen readers
- Backdrop dismissal is clearly labeled
- Prevents accidental closures with `stopPropagation()`
- Follows a clean, predictable modal structure

---

### 3. **User-Friendly Form Inputs**
**Where:** `LocationSearchBar`, Login form fields  
**What’s great:**
- Clear labels and hints that explain each input’s purpose
- Correct keyboard types and return behaviors
- Focus management improves user flow

---

### 4. **Interactive List Items**
**Where:** Location suggestions in `LocationSearchBar`  
**What’s great:**
- Each item is accessible and acts like a button
- Labels reflect real-world context (e.g., location names)
- Hints describe the action that tapping will trigger
- Strong visual hierarchy and semantic structure

---

### 5. **Accessible Switch Controls**
**Where:** Settings screen switches  
**What’s great:**
- Uses `accessibilityRole="switch"`
- Labels and hints clearly explain the control
- Color contrast ensures visibility in all themes

---

### 6. **Dismiss and Close Buttons**
**Where:** Modals and alerts  
**What’s great:**
- Buttons clearly state what will be closed
- Hints describe the result of tapping
- Consistent size and layout across components
- Uses appropriate roles and touch areas

---

### 7. **MapView with Context**
**Where:** Main screen map  
**What’s great:**
- Identified with `accessibilityRole="image"`
- Label describes the purpose and content of the map
- Adjusts visuals for dark mode with custom styling
- Supports orientation and spatial awareness

---

### 8. **Clear Logout Action**
**Where:** `LogoutButton`  
**What’s great:**
- Straightforward label and hint about what happens
- Appropriate role for a critical action

---

### 9. **Accessibility Testing in Place**
**Where:** `LocationSearchBar.test.tsx`  
**What’s great:**
- Tests use `getByLabelText()` to ensure labels are accessible
- Covers both visible text and accessibility-specific attributes
- Includes SafeAreaProvider for realistic rendering context

---

### 10. **Color Contrast & Theme Awareness**
**What’s great:**
- Uses semantic colors that adapt to light and dark modes
- Maintains strong contrast for readability(can be increased slightly in some places)

---

### 11. **Well-Structured Settings Items**
**Where:** `SettingItem` component  
**What’s great:**
- Avoids redundant announcements with `accessibilityRole="none"`
- Uses text roles for clarity
- Applies hierarchy through size and color

---

## 📌 Summary

FloodCast is already doing a lot right when it comes to accessibility:
- Interactive elements include thoughtful labels, roles, and hints
- Modals are well-structured for assistive technologies
- Forms and inputs are easy to understand and navigate
- Accessibility is built into our testing practices
- Visuals adapt to themes while maintaining contrast
- Semantic roles are consistently applied

These patterns serve as strong examples to follow as we continue to grow the app. By maintaining these standards and expanding on them, we ensure that **every user, regardless of ability, has a seamless and intuitive experience.**




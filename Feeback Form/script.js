// ============================================
// 1. Get the ID from the URL (e.g., ?id=rahul)
// ============================================
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let allPeople = [];

// ============================================
// 2. DOM References
// ============================================
const loadingScreen = document.getElementById('loading-screen');
const errorScreen = document.getElementById('error-screen');
const mainContent = document.getElementById('main-content');
const thankyouScreen = document.getElementById('thankyou-screen');

// ============================================
// 3. Fetch people.json and display data
// ============================================
fetch('people.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json();
    })
    .then(data => {
        allPeople = data;
        const person = allPeople.find(p => p.id === id);

        // Hide loading screen
        loadingScreen.classList.add('hidden');

        if (person) {
            // Show the main content
            mainContent.classList.remove('hidden');

            // Fill in the person's details
            document.getElementById('person-name').innerText = person.name;
            document.getElementById('person-designation').innerText = person.designation;
            document.getElementById('personal-note').innerText = person.note;

            // Handle the photo (show default avatar if no photo)
            const imgElement = document.getElementById('person-image');
            if (person.photo && person.photo !== '') {
                imgElement.src = person.photo;
                imgElement.alt = person.name;
            } else {
                // Use a default avatar with the person's initials
                imgElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=200&background=667eea&color=fff&bold=true&font-size=0.4`;
                imgElement.alt = person.name;
            }

            const displayName = person.name; // Already formatted as "Rahul Sir" or "Krinal Ma'am"

            // Update page title
            document.title = `Feedback for Priangshu - ${displayName}`;

            // Update form label and placeholder to be personalized
            document.getElementById('feedback-label').innerText = `Your Feedback, ${displayName}:`;
            document.getElementById('feedback').placeholder = `Please write your honest thoughts here, ${displayName}... Your words will help shape my future. Thank you so much! 🙏`;

            // Also set the thank-you name
            document.getElementById('thankyou-name').innerText = displayName;
        } else {
            // Invalid ID or no ID provided
            errorScreen.classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error loading data:', error);
        loadingScreen.classList.add('hidden');
        errorScreen.classList.remove('hidden');
    });

// ============================================
// 4. Handle form submission
// ============================================
document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const feedback = document.getElementById('feedback').value.trim();
    const person = allPeople.find(p => p.id === id);
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');

    if (!person || !feedback) return;

    // Show loading state on button
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    // =====================================================
    // EmailJS Integration
    // =====================================================
    emailjs.init('lsLE3ufsjozHHgj_L');

    emailjs.send('service_whsz3he', 'template_79wzczl', {
        person_name: person.name,
        person_designation: person.designation,
        feedback: feedback
    })
    .then(function() {
        // Success! Show thank you screen
        mainContent.classList.add('hidden');
        thankyouScreen.classList.remove('hidden');
    })
    .catch(function(error) {
        console.error('EmailJS Error:', error);
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        const statusMsg = document.getElementById('status-message');
        statusMsg.innerText = 'Oops! We encountered a slight issue. Please kindly try submitting again. Thank you!';
        statusMsg.classList.add('error');
    });
});

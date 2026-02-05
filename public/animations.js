// ========== TYPEWRITER ANIMATION CONTROLLER ==========

// Typewriter effect for single element
function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    element.classList.add('typewriter');
    let i = 0;

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typewriter');
            element.classList.add('typewriter-complete');
        }
    };

    type();
}

// Animate food info when dish detail is shown
function animateFoodInfo() {
    // Animate nutrition values
    const proteinEl = document.getElementById('detail-protein');
    const carbsEl = document.getElementById('detail-carbs');
    const fiberEl = document.getElementById('detail-fiber');

    if (proteinEl && carbsEl && fiberEl) {
        setTimeout(() => typewriterEffect(proteinEl, proteinEl.textContent, 30), 300);
        setTimeout(() => typewriterEffect(carbsEl, carbsEl.textContent, 30), 600);
        setTimeout(() => typewriterEffect(fiberEl, fiberEl.textContent, 30), 900);
    }

    // Animate ingredients list
    const ingredientsList = document.querySelectorAll('.ingredients-list li');
    ingredientsList.forEach((li, index) => {
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.animation = `slideInLeft 0.5s ease forwards`;
            li.style.animationDelay = `${1.2 + (index * 0.2)}s`;
        }, 100);
    });
}

// Animate AR nutrition info
function animateARInfo() {
    const arProtein = document.getElementById('ar-protein');
    const arCarbs = document.getElementById('ar-carbs');
    const arFiber = document.getElementById('ar-fiber');

    if (arProtein && arCarbs && arFiber) {
        setTimeout(() => typewriterEffect(arProtein, arProtein.textContent, 30), 300);
        setTimeout(() => typewriterEffect(arCarbs, arCarbs.textContent, 30), 600);
        setTimeout(() => typewriterEffect(arFiber, arFiber.textContent, 30), 900);
    }

    // Animate AR ingredients
    const arIngredients = document.querySelectorAll('#ar-ingredients-list li');
    arIngredients.forEach((li, index) => {
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.animation = `slideInLeft 0.5s ease forwards`;
            li.style.animationDelay = `${1.2 + (index * 0.2)}s`;
        }, 100);
    });
}

// Add button ripple effect
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Apply ripple to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', addRippleEffect);
    });
});

// Export functions for use in app.js
window.animateFoodInfo = animateFoodInfo;
window.animateARInfo = animateARInfo;

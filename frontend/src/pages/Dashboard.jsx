

function Dashboard() {
  return (
    <div className="d-flex">
    
      <div className="flex-grow-1">
        

        <div className="container mt-4">
          <h2>Dashboard</h2>

<div className="row mt-3 g-3">

<div className="col-lg-3">
<div className="card shadow-sm border-0">
<div className="card-body">

<i className="bi bi-cart-check text-success fs-2"></i>

<h6 className="mt-2">
Ventes
</h6>

<h2>58</h2>

<small>Aujourd'hui</small>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card shadow-sm border-0">
<div className="card-body">

<i className="bi bi-bag-check text-primary fs-2"></i>

<h6 className="mt-2">
Achats
</h6>

<h2>14</h2>

<small>Aujourd'hui</small>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card shadow-sm border-0">
<div className="card-body">

<i className="bi bi-cash-stack text-success fs-2"></i>

<h6 className="mt-2">
Chiffre d'affaires
</h6>

<h2>325000 DA</h2>

<small>Aujourd'hui</small>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card shadow-sm border-0">
<div className="card-body">

<i className="bi bi-boxes text-info fs-2"></i>

<h6 className="mt-2">
Stock total
</h6>

<h2>4 580</h2>

<small>Unités</small>

</div>
</div>
</div>

</div><div className="row mt-3 g-3">

<div className="col-lg-3">
<div className="card border-0 shadow-sm">
<div className="card-body">

<i className="bi bi-exclamation-triangle-fill text-danger fs-2"></i>

<h6 className="mt-2">
En rupture
</h6>

<h2>8</h2>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card border-0 shadow-sm">
<div className="card-body">

<i className="bi bi-clock-history text-warning fs-2"></i>

<h6 className="mt-2">
Expiration
</h6>

<h2>12</h2>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card border-0 shadow-sm">
<div className="card-body">

<i className="bi bi-star-fill text-warning fs-2"></i>

<h6 className="mt-2">
Top Produit
</h6>

<h5>Huile Elio</h5>

</div>
</div>
</div>

<div className="col-lg-3">
<div className="card border-0 shadow-sm">
<div className="card-body">

<i className="bi bi-gem text-success fs-2"></i>

<h6 className="mt-2">
Valeur Stock
</h6>

<h4>2 540 000 DA</h4>

</div>
</div>
</div>

</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;